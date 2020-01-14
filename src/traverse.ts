import path from 'path'
import { transformSync, BabelFileResult, BabelFileMetadata } from '@babel/core'

import { plugin } from './plugin'
import { PLUGIN_NAMESPACE } from './symbols'

type Result =
  | (Omit<BabelFileResult, 'metadata'> & {
      metadata: BabelFileMetadata & {
        [PLUGIN_NAMESPACE]?: { [attr: string]: Set<string> }
      }
    })
  | null

export function traverse(
  source: string,
  filename: string,
  options: { component: string; attributes: { [key: string]: string } },
): Result {
  const extname = path.extname(filename);

  // This was copied directly from
  // https://github.com/4Catalyzer/astroturf/blob/master/src/traverse.js
  return transformSync(source, {
    filename,
    babelrc: false,
    code: true,
    ast: false,
    plugins: [[plugin, options]],
    parserOpts: {
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      allowSuperOutsideMethod: true,
      sourceType: 'unambiguous',
      plugins: [
        'jsx',
        extname === '.ts' || extname === '.tsx' ? 'typescript' : 'flow',
        'doExpressions',
        'objectRestSpread',
        ['decorators', { decoratorsBeforeExport: true }],
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'asyncGenerators',
        'functionBind',
        'functionSent',
        'dynamicImport',
        'numericSeparator',
        'optionalChaining',
        'importMeta',
        'bigInt',
        'optionalCatchBinding',
        'throwExpressions',
        ['pipelineOperator', { proposal: 'minimal' }],
        'nullishCoalescingOperator',
      ],
    },
  }) as Result
}
