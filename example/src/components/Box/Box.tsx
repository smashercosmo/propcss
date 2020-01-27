import React from 'react'
import { Props } from 'propcss/dist/types'

type BoxProps = Props & {
  children: React.ReactNode
  className?: string
  customPaddingLeftProp?: number | string
}

function Box(props: BoxProps) {
  const { children, ...rest } = props
  return <div {...rest}>{children}</div>
}

export { Box }
