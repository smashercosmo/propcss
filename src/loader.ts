import path from 'path'
import fs from 'fs'
import webpack from 'webpack'
import { getOptions } from 'loader-utils'
import postcss from 'postcss'
import postcssJs from 'postcss-js'

import { traverse } from './traverse'
import { PLUGIN_NAMESPACE } from './symbols'

type PropCSSLoaderContext = webpack.loader.LoaderContext & {
  _compiler: webpack.Compiler & {
    [PLUGIN_NAMESPACE]?: {
      [resourcePath: string]: { [attr: string]: Set<number> }
    }
  }
}

const attributes: { [key: string]: string } = {
  m: 'margin',
  mt: 'margin-top',
  mb: 'margin-bottom',
  ml: 'margin-left',
  mr: 'margin-right',
  p: 'padding',
  pt: 'padding-top',
  pb: 'padding-bottom',
  pl: 'padding-left',
  pr: 'padding-right',
  w: 'width',
  h: 'height',
}

function createClasses(
  propsChunks: ReadonlyArray<{ [attr: string]: Set<number> }>,
) {
  const classes: {
    [className: string]: {
      [prop: string]: string
    }
  } = {}

  for (let l = propsChunks.length, i = 0; i < l; i += 1) {
    const propsChunk = propsChunks[i]
    const propsNames = Object.keys(propsChunk)

    for (let ll = propsNames.length, j = 0; j < ll; j += 1) {
      const propName = propsNames[j]

      if (attributes[propName]) {
        const propValues = Array.from(propsChunk[propName])

        for (let lll = propValues.length, k = 0; k < lll; k += 1) {
          const propValue = propValues[k]

          classes[`.${propName}${propValue}`] = {
            [attributes[propName]]: `${propValue}px`,
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
  const { _compiler: compiler } = this
  const options = getOptions(this)

  if (!compiler[PLUGIN_NAMESPACE]) {
    compiler[PLUGIN_NAMESPACE] = {}
  }

  if (typeof source === 'string') {
    const result = traverse(source, this.resourcePath, {
      component: options.component,
      attributes,
    })

    if (
      result &&
      result.code &&
      result.metadata &&
      result.metadata[PLUGIN_NAMESPACE]
    ) {
      const props = result.metadata[PLUGIN_NAMESPACE]
      const cache = compiler[PLUGIN_NAMESPACE]

      if (cache && props) {
        cache[this.resourcePath] = props
        const classes = createClasses(Object.values(cache))
        const file = path.join(options.path, options.filename)
        const { css } = postcss().process(classes, { parser: postcssJs })
        fs.writeFileSync(file, css, 'utf-8')
        return result.code
      }
    }
  }
  return source
}

// eslint-disable-next-line import/no-default-export
export default loader
