'use strict'

const path = require('path')
const { DefinePlugin } = require('webpack')
const nodeExternals = require('webpack-node-externals')

const TARGET_DIR = path.resolve(__dirname, '../targets/')

module.exports = function(production, app) {
  var entry = {
    onPhotoUpload: path.resolve(TARGET_DIR, './photos/services/onPhotoUpload')
  }
  var plugins = [
    new DefinePlugin({
      __TARGET__: JSON.stringify('services')
    })
  ]
  var target = 'node'

  return {
    entry: entry,
    output: {
      path: path.resolve(__dirname, `../build/${app}`),
      filename: '[name].js'
    },
    plugins: plugins,
    target: target,
    externals: [nodeExternals()]
  }
}
