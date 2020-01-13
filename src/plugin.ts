/* eslint-disable no-param-reassign */
import babel, {
  types as T,
  NodePath,
  PluginObj,
  BabelFileMetadata,
} from '@babel/core'

import { PLUGIN_NAMESPACE } from './symbols'

function isAttrAllowed(aliasMap: { [key: string]: string }, attr: string) {
  return Boolean(aliasMap[attr])
}

type File = {
  metadata: BabelFileMetadata & {
    [PLUGIN_NAMESPACE]?: { [attr: string]: Set<number> }
  }
  set(key: any, val: any): void
  get(key: any): any
  has(key: any): boolean
}

type State = {
  file: File
  opts: {
    component: string
    attributes: { [key: string]: string }
  }
}

export function plugin(api: typeof babel): PluginObj<State> {
  const t = api.types

  function isAtomicAttribute(
    attribute: T.JSXAttribute | T.JSXSpreadAttribute,
    state: State,
  ) {
    return (
      t.isJSXAttribute(attribute) &&
      t.isJSXIdentifier(attribute.name) &&
      isAttrAllowed(state.opts.attributes, attribute.name.name)
    )
  }

  function getClassNameAttributeValue(
    attributes: Array<T.JSXAttribute | T.JSXSpreadAttribute>,
  ) {
    const classNameAttribute = attributes.find(attribute => {
      return (
        t.isJSXAttribute(attribute) &&
        t.isJSXIdentifier(attribute.name) &&
        attribute.name.name === 'className'
      )
    })

    if (!classNameAttribute || !t.isJSXAttribute(classNameAttribute)) {
      return null
    }

    if (t.isStringLiteral(classNameAttribute.value)) {
      return classNameAttribute.value
    }

    if (
      t.isJSXExpressionContainer(classNameAttribute.value) &&
      !t.isJSXElement(classNameAttribute.value.expression) &&
      !t.isJSXFragment(classNameAttribute.value.expression) &&
      !t.isJSXEmptyExpression(classNameAttribute.value.expression)
    ) {
      return classNameAttribute.value.expression
    }

    return null
  }

  function generateClassName(
    attributes: Array<T.JSXAttribute | T.JSXSpreadAttribute>,
    classes: Set<string | number>,
  ) {
    const classNameAttributeValue = getClassNameAttributeValue(attributes)

    attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('className'),
        t.jsxExpressionContainer(
          t.callExpression(
            t.memberExpression(
              t.arrayExpression([
                t.stringLiteral(Array.from(classes).join(' ')),
                classNameAttributeValue,
              ]),
              t.identifier('join'),
            ),
            [t.stringLiteral(' ')],
          ),
        ),
      ),
    )
  }

  return {
    pre(file: File) {
      if (!file.has(PLUGIN_NAMESPACE)) {
        file.set(PLUGIN_NAMESPACE, {})
      }
    },
    post(file: File) {
      file.metadata[PLUGIN_NAMESPACE] = file.get(PLUGIN_NAMESPACE)
    },
    visitor: {
      JSXOpeningElement(path: NodePath<T.JSXOpeningElement>, state) {
        if (
          t.isJSXIdentifier(path.node.name) &&
          path.node.name.name === state.opts.component
        ) {
          const classes = new Set<string | number>()
          path.node.attributes.forEach(attribute => {
            if (
              t.isJSXAttribute(attribute) &&
              t.isJSXIdentifier(attribute.name) &&
              t.isJSXExpressionContainer(attribute.value) &&
              t.isNumericLiteral(attribute.value.expression) &&
              isAttrAllowed(state.opts.attributes, attribute.name.name)
            ) {
              const { name } = attribute.name
              const { value } = attribute.value.expression

              if (!state.file.get(PLUGIN_NAMESPACE)[name]) {
                state.file.get(PLUGIN_NAMESPACE)[name] = new Set()
              }

              state.file.get(PLUGIN_NAMESPACE)[name].add(value)
              classes.add(`${name}${value}`)
            }
          })

          // remove all atomic attributes
          path.node.attributes = path.node.attributes.filter(
            attribute => !isAtomicAttribute(attribute, state),
          )

          generateClassName(path.node.attributes, classes)
        }
      },
    },
  }
}
