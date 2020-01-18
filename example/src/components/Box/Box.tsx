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
  margin?: number | string
  marginTop?: number | string
  marginBottom?: number | string
  marginLeft?: number | string
  marginRight?: number | string
  padding?: number | string
  paddingTop?: number | string
  paddingBottom?: number | string
  paddingLeft?: number | string
  paddingRight?: number | string
  width?: number | string
  height?: number | string
  customPaddingLeftProp?: number | string
}

function Box(props: BoxProps) {
  const { children, ...rest } = props
  return <div {...rest}>{children}</div>
}

export { Box }
