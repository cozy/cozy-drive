'use strict'

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const pkg = require(path.resolve(__dirname, '../package.json'))

module.exports = {
  entry: {
    app: path.resolve(__dirname, '../src/main'),
    services: path.resolve(__dirname, '../src/services'),
    'public/app': path.resolve(__dirname, '../src/targets/public/main')
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js'
  },
  externals: {
    'cozy-client-js': 'cozy'
  },
  plugins: [
    new webpack.DefinePlugin({
      __TARGET__: JSON.stringify('browser')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/targets/public/index.ejs'),
      title: pkg.name,
      filename: 'public/index.html',
      chunks: ['public/app'],
      inject: 'head',
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}
