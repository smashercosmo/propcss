let NUMBER_REGEXP = /^-?\d+$/

let CSS_UNIT_REGEXP = /^em|ex|ch|rem|lh|vw|vh|vmin|vmax|cm|mm|Q|in|pc|pt|px|%$/

function tokenize(input: string) {
  let current = 0
  let tokens: { sign?: string; number?: string; string?: string } = {}

  while (current < input.length) {
    let char = input[current]

    let NUMBERS = /[0-9]/
    if (NUMBERS.test(char)) {
      let value = ''

      while (NUMBERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.number = value
      continue
    }

    let SIGNS = /[-+]/
    if (SIGNS.test(char)) {
      tokens.sign = char
      current++
      continue
    }

    let LETTERS = /[a-zA-Z%]/
    // NB! LETTERS.test(undefined) => true
    if (char && LETTERS.test(char)) {
      let value = ''

      while (char && LETTERS.test(char)) {
        value += char
        char = input[++current]
      }

      tokens.string = value
      continue
    }

    throw new TypeError('I dont know what this character is: ' + char)
  }

  return tokens
}

export function normalizeValue(value: string) {
  if (value === '0') {
    return '0'
  }
  if (NUMBER_REGEXP.test(value)) {
    return `${value}px`
  }
  return value
}

export function normalizeClassName(name: string, value: string) {
  const { number, string, sign } = tokenize(value)
  const isUnit = CSS_UNIT_REGEXP.test(string || '')
  const unit = isUnit && string === 'px' ? '' : string
  const classNameParts = [
    name,
    sign === '-' ? 'neg' : undefined,
    number && isUnit ? number + unit : number,
    isUnit ? undefined : string,
  ].filter(Boolean)

  return classNameParts.join('-')
}
