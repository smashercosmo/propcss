import cssesc from 'cssesc'

const NUMBER_REGEXP = /^\d+$/
const NUMBER_PX_REGEXP = /^(\d+)px$/

export function normalizeValue(value: string | number) {
  const strValue = String(value)
  if (strValue === '0') {
    return '0'
  }
  if (NUMBER_REGEXP.test(strValue)) {
    return `${strValue}px`
  }
  return strValue
}

export function normalizeClassName(
  name: string,
  value: string | number,
  isIdentifier: boolean,
) {
  const strValue = String(value)
  const match = strValue.match(NUMBER_PX_REGEXP)
  if (match) {
    return name + match[1]
  }
  return cssesc(name + strValue, { isIdentifier })
}
