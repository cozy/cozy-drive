'use strict'

const path = require('path')
const { DefinePlugin } = require('webpack')

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
    new DefinePlugin({
      __TARGET__: JSON.stringify('browser')
    })
  ]
}
