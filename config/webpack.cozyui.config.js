'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const build = /production$/.test(process.env.NODE_ENV)

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style', [
          'css?importLoaders=1&modules',
          'postcss',
          'stylus'
        ])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(build ? 'app.[hash].css' : 'app.css')
  ],
  stylus: {
    use: [ require('cozy-ui/stylus')() ]
  }
}
