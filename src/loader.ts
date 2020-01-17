import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import { getOptions } from 'loader-utils'
import postcss from 'postcss'
import postcssJs from 'postcss-js'

import { traverse } from './traverse'
import { attributes } from './attributes'
import { PLUGIN_NAMESPACE } from './symbols'
import { normalizeClassName, normalizeValue } from './utils'

type PropCSSLoaderContext = webpack.loader.LoaderContext & {
  _compiler: webpack.Compiler & {
    [PLUGIN_NAMESPACE]?: {
      [resourcePath: string]: { [attr: string]: Set<string> }
    }
  }
}

function createClasses(
  propsChunks: ReadonlyArray<{ [attr: string]: Set<string> }>,
) {
  let classes: {
    [className: string]: {
      [prop: string]: string
    }
  } = {}

  for (let l = propsChunks.length, i = 0; i < l; i += 1) {
    let propsChunk = propsChunks[i]
    let propsNames = Object.keys(propsChunk)

    for (let ll = propsNames.length, j = 0; j < ll; j += 1) {
      let propName = propsNames[j]

      if (attributes[propName]) {
        let propValues = Array.from(propsChunk[propName])

        for (let lll = propValues.length, k = 0; k < lll; k += 1) {
          let propValue = propValues[k]
          let className = `.${normalizeClassName(propName, propValue, true)}`

          classes[className] = {
            [attributes[propName]]: normalizeValue(propValue),
          }
        }
      }
    }
  }

  return classes
}

function loader(
  this: PropCSSLoaderContext,
  source: string | Buffer,
): string | Buffer | void | undefined {
  let { _compiler: compiler } = this
  let options = getOptions(this)

  if (!compiler[PLUGIN_NAMESPACE]) {
    compiler[PLUGIN_NAMESPACE] = {}
  }

  if (typeof source === 'string') {
    let result = traverse(source, this.resourcePath, {
      component: options.component,
      attributes,
    })

    if (
      result &&
      result.code &&
      result.metadata &&
      result.metadata[PLUGIN_NAMESPACE]
    ) {
      let props = result.metadata[PLUGIN_NAMESPACE]
      let cache = compiler[PLUGIN_NAMESPACE]

      if (cache && props) {
        cache[this.resourcePath] = props
        let classes = createClasses(Object.values(cache))
        let file = path.join(options.path, options.filename)
        let { css } = postcss().process(classes, { parser: postcssJs })
        fs.writeFileSync(file, css, 'utf-8')
        return result.code
      }
    }
  }
  return source
}

// eslint-disable-next-line import/no-default-export
export default loader
