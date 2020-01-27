const path = require('path')
const appRootPath = require('app-root-path')
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const optimize = process.env.NODE_ENV === 'production'
const ROOT_DIR = appRootPath.toString()
const APP_DIR = path.resolve(ROOT_DIR, 'src')
const DIST_DIR = path.resolve(ROOT_DIR, 'dist')

const config = {
  entry: optimize
    ? [path.resolve(APP_DIR, 'index.tsx')]
    : [path.resolve(APP_DIR, 'index.tsx'), 'webpack-plugin-serve/client'],
  mode: optimize ? 'production' : 'development',
  output: {
    path: DIST_DIR,
    filename: optimize ? '[name].[contenthash].js' : '[name].js',
    publicPath: '/',
  },
  devtool: optimize ? 'source-map' : 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [APP_DIR],
        use: [
          'babel-loader',
          {
            loader: 'propcss',
            options: {
              path: APP_DIR,
              filename: 'index.css',
              component: 'Box',
              componentPropToCSSPropMapping: {
                customPaddingLeftProp: 'padding-left',
              },
              CSSPropToClassNameMapping: {
                'padding-left': 'customPaddingLeftCSSClass',
              },
            },
          },
        ],
      },
      {
        test: /\.css$/,
        include: [APP_DIR],
        use: [
          optimize ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    ...(optimize
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
          }),
        ]
      : []),
    ...(optimize
      ? []
      : [
          new Serve({
            port: 8000,
            host: 'localhost',
            static: [DIST_DIR],
          }),
        ]),
  ],
  watch: !optimize,
}

module.exports = config
