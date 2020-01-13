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
    <Box pr={20} ml={40} w={200} className="customClassName" />
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
    <Box className="pr20 ml40 w200 customClassName" />
  )
}
```
**index.css**
```css
.pr20 { padding-right: 20px }
.ml40 { margin-left: 40px }
.w200 { width: 200px }
```

# Usage
(NB: not yet published)
```
npm install propcss
```

Create your base component (or just set 'div' as your base component name)
```jsx
import React from 'react'

function Box(props: BoxProps) {
  const { children, ...rest } = props
  return <div {...rest}>{children}</div>
}

export { Box }
```

Add propcss/loader to your webpack config along with babel-loader
```
{
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
          {
            loader: 'propcss-loader',
            options: {
              path: APP_DIR,
              filename: 'index.css', // file, where your atomic styles will be written to
              component: 'Box', // name of your base component (could be just any html tag)
            },
          },
        ],
      },
    }
  }
}
```

# TODO
+ Tests
+ Support for simple expressions
```jsx
    <Box m={expression ? 10 : 16} />
```
+ Support for both numeric and string values
```jsx
    <Box m={16} w="100vw" />
```
+ Support for multiple base components
+ Support other bundlers (parcel, rollup)
+ Support for both full and shorthand props
```
```jsx
    <Box m={16} paddingLeft={32} />
```
+ Integration with tailwindcss
+ Cleaning up unused styles in dev mode? (not an issue for prod builds)
+ Using virtual modules instead of writing to disk
+ Responsive styles 
 ```jsx
     <Box m={[16, 32, 64]} />
 ```
+ Source maps. With current implementation source maps don't make sense, because styles from different files are aggregated and deduplicated. Maybe it makes sense to not deduplicate styles in dev mode.
+ Better name for the package 