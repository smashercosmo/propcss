declare module 'postcss-js' {
  import { Parser, Root } from 'postcss'

  const parser: Parser & { objectify: (root: Root) => object }
  // eslint-disable-next-line import/no-default-export
  export default parser
}
