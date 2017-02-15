'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: [path.resolve(__dirname, '../src/main')],
  output: {
    path: path.resolve(__dirname, '../build')
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
