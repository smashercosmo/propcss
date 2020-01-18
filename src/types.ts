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
