import babel, { types as t, NodePath, PluginObj } from '@babel/core'

import { STYLES } from './symbols'

type AllowedAttrsMap = {
  [key: string]: any
}

const allowedAttrs: AllowedAttrsMap = {
  m: true,
  mt: true,
  mb: true,
  ml: true,
  mr: true,
  p: true,
  pt: true,
  pb: true,
  pl: true,
  pr: true,
  w: true,
  h: true
}

function isAttrAllowed(attr: string) {
  return Boolean(allowedAttrs[attr])
}

type File = {
  metadata: { propcss: Set<string> }
  set(key: any, val: any): void
  get(key: any): any
  has(key: any): boolean
}

type State = {
  file: File
}

export default function plugin(api: typeof babel): PluginObj<State> {
  const t = api.types

  return {
    pre(file: File) {
      if (!file.has(STYLES)) {
        file.set(STYLES, {})
      }
    },
    post(file: File) {
      file.metadata.propcss = file.get(STYLES);
    },
    visitor:
      {
        JSXOpeningElement(path: NodePath<t.JSXOpeningElement>, state) {
          if (t.isJSXIdentifier(path.node.name)) {
            if (path.node.name.name === 'Box') {
              path.node.attributes.forEach(attribute => {
                if (t.isJSXAttribute(attribute) && t.isJSXIdentifier(attribute.name) && t.isStringLiteral(attribute.value) && isAttrAllowed(attribute.name.name)) {
                  state.file.get(STYLES)[attribute.name.name] = attribute.value.value
                }
              })
            }
          }
        }
      },
  };
}