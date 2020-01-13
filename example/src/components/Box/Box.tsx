import React from 'react'

type BoxProps = {
  children: React.ReactNode
  className?: string
  m?: number
  mt?: number
  mb?: number
  ml?: number
  mr?: number
  p?: number
  pt?: number
  pb?: number
  pl?: number
  pr?: number
  w?: number
  h?: number
}

function Box(props: BoxProps) {
  const { children, ...rest } = props
  return <div {...rest}>{children}</div>
}

export { Box }
