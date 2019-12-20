import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { Plugin } from './plugin'

const optimize = process.env.NODE_ENV === 'production'

const config: webpack.Configuration = {
  mode: optimize ? 'production' : 'development',
  output: {
    filename: optimize ? '[name].[contenthash].js' : '[name].js',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
            }
          },
          'propcss-loader',
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  resolveLoader: {
    alias: {
      'propcss-loader': path.resolve('./loader.ts')
    },
  },
  plugins: [
    new Plugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ]
}

export default config