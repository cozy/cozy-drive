'use strict'

const { extractor } = require('./webpack.vars')

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: extractor.extract('style', [
          'css-loader?importLoaders=1&modules&localIdentName=[local]--[hash:base64:5]',
          'postcss-loader',
          'stylus-loader'
        ])
      }
    ]
  },
  stylus: {
    use: [ require('cozy-ui/stylus')() ]
  }
}
