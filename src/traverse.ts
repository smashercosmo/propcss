import { transformSync, BabelFileResult, BabelFileMetadata } from '@babel/core'

import { plugin } from './plugin'
import { PLUGIN_NAMESPACE } from './symbols'

type Result =
  | (Omit<BabelFileResult, 'metadata'> & {
      metadata: BabelFileMetadata & {
        [PLUGIN_NAMESPACE]?: { [attr: string]: Set<number> }
      }
    })
  | null

export function traverse(
  source: string,
  filename: string,
  options: { component: string; attributes: { [key: string]: string } },
): Result {
  return transformSync(source, {
    filename,
    babelrc: false,
    code: true,
    ast: false,
    plugins: [[plugin, options]],
  }) as Result
}
