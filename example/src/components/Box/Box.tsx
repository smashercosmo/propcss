import React from 'react'

type BoxProps = {
  children: React.ReactNode
  className?: string
  m?: number | string
  mt?: number | string
  mb?: number | string
  ml?: number | string
  mr?: number | string
  p?: number | string
  pt?: number | string
  pb?: number | string
  pl?: number | string
  pr?: number | string
  w?: number | string
  h?: number | string
}

function Box(props: BoxProps) {
  const { children, ...rest } = props
  return <div {...rest}>{children}</div>
}

export { Box }
