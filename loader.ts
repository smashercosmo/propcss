import webpack from 'webpack'
import traverse from './traverse'
import { STYLES } from './symbols'

const loader: webpack.loader.Loader = function(source: string | Buffer) {
  const { _compilation: compilation } = this
  if (typeof source === 'string') {
    const result = traverse(source, this.resourcePath)
    if (result) {
      // @ts-ignore
      Object.assign(compilation[STYLES], result.metadata.propcss)
      // @ts-ignore
      console.log(this.resourcePath, 'compilation', compilation[STYLES])
    }
  }
  return source
}

export default loader
