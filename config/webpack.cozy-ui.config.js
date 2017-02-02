'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PostCSSAssetsPlugin = require('postcss-assets-webpack-plugin')

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
          'css-loader?importLoaders=1&modules',
          'postcss-loader',
          'stylus-loader'
        ])
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin(build ? 'app.[hash].css' : 'app.css'),
    new PostCSSAssetsPlugin({
      test: /\.css$/,
      plugins: [
        require('css-mqpacker'),
        require('postcss-discard-duplicates'),
        require('postcss-discard-empty'),
        require('csswring')({preservehacks: true, removeallcomments: true})
      ]
    })
  ],
  stylus: {
    use: [ require('cozy-ui/stylus')() ]
  }
}
