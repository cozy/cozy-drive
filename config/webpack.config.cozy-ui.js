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
          'css?importLoaders=1&modules',
          'postcss',
          'stylus'
        ])
      }
    ]
  },
  plugins: [
    extractor
  ],
  stylus: {
    use: [ require('cozy-ui/stylus')() ]
  }
}
