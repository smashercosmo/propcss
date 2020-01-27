/* eslint-disable no-param-reassign */
import { types as t, NodePath, PluginObj, BabelFileMetadata } from '@babel/core'
import htmlTags from 'html-tags'

import { PLUGIN_NAMESPACE } from './symbols'
import { normalizeClassName } from './utils'
import { PluginOptions } from './types'

type File = {
  metadata: BabelFileMetadata & {
    [PLUGIN_NAMESPACE]?: { [attr: string]: Set<string> }
  }
  set(key: any, val: any): void
  get(key: any): any
  has(key: any): boolean
}

type State = {
  file: File
  opts: PluginOptions
}

function isAttrAllowed(aliasMap: { [key: string]: string }, attr: string) {
  return Boolean(aliasMap[attr])
}

function getAttributeValue(attribute: t.JSXAttribute | t.JSXSpreadAttribute) {
  if (!t.isJSXAttribute(attribute)) {
    return undefined
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

  return undefined
}

/**
 * Generates jsx expression for className attribute:
 * "className={["atomicClass1 atomicClass2", originalClassNameAttributeExpression].join(' ')}"
 */
function generateClassName(
  classes: Set<string | number>,
  classNameAttribute?: t.JSXAttribute,
) {
  let classNameAttributeValue = classNameAttribute
    ? getAttributeValue(classNameAttribute)
    : undefined

  if (classes.size === 0) {
    return classNameAttribute
  }

  return t.jsxAttribute(
    t.jsxIdentifier('className'),
    t.jsxExpressionContainer(
      t.callExpression(
        t.memberExpression(
          t.arrayExpression([
            t.stringLiteral(Array.from(classes).join(' ')),
            classNameAttributeValue || null,
          ]),
          t.identifier('join'),
        ),
        [t.stringLiteral(' ')],
      ),
    ),
  )
}

function handleStringLiteral(value: t.StringLiteral, values: Set<string>) {
  values.add(value.value)
}

function handleNumericLiteral(value: t.NumericLiteral, values: Set<string>) {
  values.add(String(value.value))
}

function handleUnaryExpression(
  expression: t.UnaryExpression,
  values: Set<string>,
) {
  if (expression.operator === '-' && t.isNumericLiteral(expression.argument)) {
    values.add(expression.operator + String(expression.argument.value))
  }
}

function handleExpressionContainer(
  value: t.JSXExpressionContainer,
  values: Set<string>,
) {
  if (t.isNumericLiteral(value.expression)) {
    handleNumericLiteral(value.expression, values)
  } else if (t.isUnaryExpression(value.expression)) {
    handleUnaryExpression(value.expression, values)
  }
}

export function plugin(_api: any, options: PluginOptions): PluginObj<State> {
  let {
    componentPropToCSSPropMapping,
    CSSPropToClassNameMapping,
    components,
  } = options

  let allowedComponents = components ? new Set(components) : new Set(htmlTags)

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
        let classes = new Set<string>()
        let classNameAttribute: t.JSXAttribute | undefined
        let nonAtomicAttributes = []

        if (
          t.isJSXIdentifier(path.node.name) &&
          allowedComponents.has(path.node.name.name)
        ) {
          for (let i = 0, l = path.node.attributes.length; i < l; i += 1) {
            let attribute = path.node.attributes[i]
            if (
              t.isJSXAttribute(attribute) &&
              t.isJSXIdentifier(attribute.name)
            ) {
              if (attribute.name.name === 'className') {
                classNameAttribute = attribute
              } else if (
                !isAttrAllowed(
                  componentPropToCSSPropMapping,
                  attribute.name.name,
                )
              ) {
                nonAtomicAttributes.push(attribute)
              } else {
                let { name: propName } = attribute.name
                let values: Set<string> = new Set()

                if (t.isStringLiteral(attribute.value)) {
                  handleStringLiteral(attribute.value, values)
                } else if (t.isJSXExpressionContainer(attribute.value)) {
                  handleExpressionContainer(attribute.value, values)
                }

                if (!state.file.get(PLUGIN_NAMESPACE)[propName]) {
                  state.file.get(PLUGIN_NAMESPACE)[propName] = new Set()
                }

                let valuesArr = Array.from(values)

                for (let ii = 0, ll = valuesArr.length; ii < ll; ii += 1) {
                  let value = valuesArr[ii]
                  let cssProp = componentPropToCSSPropMapping[propName]
                  classes.add(
                    normalizeClassName(
                      CSSPropToClassNameMapping[cssProp],
                      value,
                      false,
                    ),
                  )
                  state.file.get(PLUGIN_NAMESPACE)[propName].add(value)
                }
              }
            }
          }

          path.node.attributes = nonAtomicAttributes

          let newClassNameAttribute = generateClassName(
            classes,
            classNameAttribute,
          )

          if (newClassNameAttribute) {
            path.node.attributes.push(newClassNameAttribute)
          }
        }
      },
    },
  }
}
