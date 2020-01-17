import cssesc from 'cssesc'

let NUMBER_REGEXP = /^-?\d+$/
let NUMBER_PX_REGEXP = /^(\d+)px$/

export function normalizeValue(value: string) {
  if (value === '0') {
    return '0'
  }
  if (NUMBER_REGEXP.test(value)) {
    return `${value}px`
  }
  return value
}

export function normalizeClassName(
  name: string,
  value: string,
  isIdentifier: boolean,
) {
  let match = value.match(NUMBER_PX_REGEXP)
  if (match) {
    return name + match[1]
  }
  return cssesc(name + value, { isIdentifier })
}
