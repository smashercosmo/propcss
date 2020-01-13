/* eslint-disable no-param-reassign */
import { types as t, NodePath, PluginObj, BabelFileMetadata } from '@babel/core'

import { PLUGIN_NAMESPACE } from './symbols'
import { normalizeClassName } from './utils'

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

function isAttrAllowed(aliasMap: { [key: string]: string }, attr: string) {
  return Boolean(aliasMap[attr])
}

function getAttributeValue(
  attribute: t.JSXAttribute | t.JSXSpreadAttribute | undefined,
) {
  if (!attribute || !t.isJSXAttribute(attribute)) {
    return null
  }

  if (t.isStringLiteral(attribute.value)) {
    return attribute.value
  }

  if (
    t.isJSXExpressionContainer(attribute.value) &&
    !t.isJSXElement(attribute.value.expression) &&
    !t.isJSXFragment(attribute.value.expression) &&
    !t.isJSXEmptyExpression(attribute.value.expression)
  ) {
    return attribute.value.expression
  }

  return null
}

function getClassNameAttributeValue(
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
) {
  const classNameAttribute = attributes.find(attribute => {
    return (
      t.isJSXAttribute(attribute) &&
      t.isJSXIdentifier(attribute.name) &&
      attribute.name.name === 'className'
    )
  })

  return getAttributeValue(classNameAttribute)
}

/**
 * Generates jsx expression for className attribute:
 * "className={["atomicClass1 atomicClass2", originalClassNameAttributeExpression].join(' ')}"
 */
function generateClassName(
  attributes: Array<t.JSXAttribute | t.JSXSpreadAttribute>,
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

function isAtomicAttribute(
  attribute: t.JSXAttribute | t.JSXSpreadAttribute,
  state: State,
) {
  return (
    t.isJSXAttribute(attribute) &&
    t.isJSXIdentifier(attribute.name) &&
    isAttrAllowed(state.opts.attributes, attribute.name.name)
  )
}

function getAtomicAttributeValue(value: t.StringLiteral | t.Expression | null) {
  if (t.isStringLiteral(value) || t.isNumericLiteral(value)) {
    return value.value
  }
  return null
}

export function plugin(): PluginObj<State> {
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
      JSXOpeningElement(path: NodePath<t.JSXOpeningElement>, state) {
        if (
          t.isJSXIdentifier(path.node.name) &&
          path.node.name.name === state.opts.component
        ) {
          const classes = new Set<string | number>()
          path.node.attributes.forEach(attribute => {
            const value = getAtomicAttributeValue(getAttributeValue(attribute))
            if (
              t.isJSXAttribute(attribute) &&
              t.isJSXIdentifier(attribute.name) &&
              isAttrAllowed(state.opts.attributes, attribute.name.name) &&
              value
            ) {
              const { name } = attribute.name

              if (!state.file.get(PLUGIN_NAMESPACE)[name]) {
                state.file.get(PLUGIN_NAMESPACE)[name] = new Set()
              }

              state.file.get(PLUGIN_NAMESPACE)[name].add(value)
              classes.add(normalizeClassName(name, value, false))
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
