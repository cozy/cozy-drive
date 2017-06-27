'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    app: [path.resolve(__dirname, '../src/main')],
    services: [path.resolve(__dirname, '../src/services')]
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
    })
  ]
}
