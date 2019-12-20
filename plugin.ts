import webpack from 'webpack'
import VirtualModulesPlugin from 'webpack-virtual-modules'
import { STYLES } from './symbols'

const PLUGIN = 'PropCSSPlugin';

class Plugin {
  virtualModules: InstanceType<typeof VirtualModulesPlugin>
  styles: Map<string, string | string[]>

  constructor() {
    this.virtualModules = new VirtualModulesPlugin()
    this.styles = new Map()
  }

  apply(compiler: webpack.Compiler) {
    this.virtualModules.apply(compiler)

    compiler.hooks.compilation.tap(PLUGIN, compilation => {
      // @ts-ignore
      compilation[STYLES] = {}

      this.virtualModules.writeModule(
        'node_modules/propcss/propcss.css',
        '.default { width: 100%; }'
      );

      compilation.hooks.normalModuleLoader.tap(PLUGIN, (loaderContext, module) => {
        loaderContext.virtualModules = this.virtualModules
        loaderContext.styles = this.styles
      })
    })
  }
}

export { Plugin }
