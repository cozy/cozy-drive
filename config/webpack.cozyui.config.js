'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const build = process.env.NODE_ENV === 'production'

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract([
          'css-loader?importLoaders=1',
          'postcss-loader',
          'stylus-loader'
        ])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(build ? 'app.[hash].css' : 'app.css')
  ],
  stylus: {
    use: [require('cozy-ui/stylus')()]
  }
}
