export type CommonOptions = {
  componentPropToCSSPropMapping: { [componentProp: string]: string }
  CSSPropToClassNameMapping: { [cssProp: string]: string }
}

export type LoaderOptions = Partial<CommonOptions> & {
  component: string
  path: string
  filename: string
}

export type PluginOptions = CommonOptions & {
  component: string
}

export type Props = {
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
}
