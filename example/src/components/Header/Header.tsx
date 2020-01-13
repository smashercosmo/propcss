import React from 'react'

import { Box } from '../Box/Box'

type HeaderProps = {
  children: React.ReactNode
}

function Header(props: HeaderProps) {
  const { children } = props
  return (
    <h1>
      {children}
      <Box m={14} pt={100} className={['class1', 'class2'].join(' ')}>
        d
      </Box>
    </h1>
  )
}

export { Header }
