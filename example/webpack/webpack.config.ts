import path from 'path'
import webpack from 'webpack'
import appRootPath from 'app-root-path'
import { WebpackPluginServe as Serve } from 'webpack-plugin-serve'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const optimize = process.env.NODE_ENV === 'production'
const ROOT_DIR = appRootPath.toString()
const APP_DIR = path.resolve(ROOT_DIR, 'src')
const DIST_DIR = path.resolve(ROOT_DIR, 'dist')

const config: webpack.Configuration = {
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
            loader: 'propcss-loader',
            options: {
              path: APP_DIR,
              filename: 'index.css',
              component: 'Box',
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
    alias: {
      react: path.resolve(ROOT_DIR, 'node_modules/react'),
      'react-dom': path.resolve(ROOT_DIR, 'node_modules/react-dom'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  resolveLoader: {
    alias: {
      'propcss-loader': path.resolve(ROOT_DIR, '..', 'src/loader.ts'),
    },
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

// eslint-disable-next-line import/no-default-export
export default config
