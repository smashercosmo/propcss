/* eslint-disable global-require, @typescript-eslint/no-var-requires */

import React from 'react'
import ReactDOM from 'react-dom'

import { Root } from './components/Root/Root'

function start(RootComponent: React.ElementType, node: HTMLElement): void {
  ReactDOM.render(<RootComponent />, node)
}

const elem = document.getElementById('root')

if (!elem) {
  throw new Error('no DOM element')
}

start(Root, elem)

if (module.hot) {
  module.hot.accept(['./components/Root/Root'], () => {
    const { Root: NextRoot } = require('./components/Root/Root')
    start(NextRoot, elem)
  })
}
