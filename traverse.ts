import path from 'path';
import { transformSync } from '@babel/core';
import plugin from './babel-plugin';

export default function traverse(source: string, filename: string) {
  const extname = path.extname(filename);

  return transformSync(source, {
    filename,
    babelrc: false,
    code: false,
    ast: false,
    plugins: [[plugin]],
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
  });
}