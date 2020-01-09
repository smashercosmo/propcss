import React from 'react'

import '../../index.css'
import { Header } from '../Header/Header'
import { Box } from '../Box/Box'

type RootProps = {
  children: React.ReactNode
}

function Root(props: RootProps) {
  const { children } = props
  return (
    <div>
      <Header>Header</Header>
      <Box p={30}>{children}</Box>
    </div>
  )
}

export { Root }
