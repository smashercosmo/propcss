# PropCSS
like styled-system, but without any css-in-js burden

# Motivation

# How it works
propcss webpack loader will extract atomic props from your base components, convert them to valid css and write to css file.

input:

**Component.js**
```jsx
import React from 'react'

export default function Component() {
  return (
    <div pr={20} ml={40} w={200} className="customClassName" />
  )
}
```
---
output:

**Component.js**
```jsx
import React from 'react'

export default function Component() {
  return (
    <div className="pr-20 ml-40 w-200 customClassName" />
  )
}
```
**index.css**
```css
.pr-20 { padding-right: 20px }
.ml-40 { margin-left: 40px }
.w-200 { width: 200px }
```

# Usage (NB: not yet published)
```
npm install propcss
```

Add propcss loader to your webpack config along with babel-loader
```
{
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'propcss',
            options: {
              filepath: path.resolve(__dirname, 'src/atomic.css'), 
            },
          },
        ],
      },
    }
  }
}
```

## Options

|                    Name                                               |            Type              | Default                                                                   | Description                                                            |
| :-------------------------------------------------------------------: | :--------------------------: | :-----------------------------------------------------------------------: | :--------------------------------------------------------------------- |
| **[`filepath`](#filepath)**                                           | `{string}`                   |                                                                           | Path to the file, where your atomic css classes will be written to     |
| **[`components`](#components)**                                       | `{string[]=}`                | Array of all html tags                                                    | Which components should be processed by loader                         |
| **[`CSSPropToClassNameMapping`](#CSSPropToClassNameMapping)**         | `{object=}`                  | https://github.com/smashercosmo/propcss/blob/master/src/attributes.ts#L1  | Defines atomic classes for corresponding css properties.               |
| **[`componentPropToCSSPropMapping`](#componentPropToCSSPropMapping)** | `{object=}`                  | https://github.com/smashercosmo/propcss/blob/master/src/attributes.ts#L28 | Defines component properties for corresponding css properties.         |

### `filepath`

Type: `string`
Required: `true`

Path to the file, where your atomic css classes will be written to

### `components`

Type: `string[]`
Required: `false`
Default: `Array of all html tags `

Defines, which components should be processed by loader.     

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'propcss',
            options: {
              filepath: path.resolve(__dirname, 'src/atomic.css'),
              components: ['Box', 'Text', 'div'] // only these three components will be processed by loader
            },
          },
        ],
      },
    ],
  },
};
```

### `CSSPropToClassNameMapping`

Type: `object`
Required: `false`
Default: https://github.com/smashercosmo/propcss/blob/master/src/attributes.ts#L1

Defines atomic classes for corresponding css properties.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'propcss',
            options: {
              filepath: path.resolve(__dirname, 'src/atomic.css'),
              CSSPropToClassNameMapping: {
                'padding-left': 'customPaddingLeftCSSClass',
              }
            },
          },
        ],
      },
    ],
  },
};
```
input:
```jsx
export default function Component() {
  return <div pl={20} />
}
```

output:
```jsx
export default function Component() {
  return <div className="customPaddingLeftCSSClass-20" />
}
```

### `componentPropToCSSPropMapping`

Type: `object`
Required: `false`
Default: https://github.com/smashercosmo/propcss/blob/master/src/attributes.ts#L28

Defines component properties for corresponding css properties.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'propcss',
            options: {
              filepath: path.resolve(__dirname, 'src/atomic.css'),
              componentPropToCSSPropMapping: {
                customPaddingLeftProp: 'padding-left',
              }
            },
          },
        ],
      },
    ],
  },
};
```
input:
```jsx
export default function Component() {
  return <div customPaddingLeftProp={20} />
}
```

output:
```jsx
export default function Component() {
  return <div className="pl-20" />
}
```