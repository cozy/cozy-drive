'use strict'

const { LoaderOptionsPlugin } = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  resolve: {
    extensions: ['.styl']
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        // INFO: cf https://webpack.js.org/configuration/module/#rule-conditions
        // "common conditions like /node_modules/ may inadvertently miss symlinked files."
        // This is probably why the condition below generated errors with a yarn linked cozy-ui.
        // exclude: /(node_modules)/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
                importLoaders: 1,
                modules: true,
                localIdentName: '[local]--[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                plugins: () => [require('autoprefixer')({ browsers: ['last 2 versions'] })]
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },
  plugins: [
    new LoaderOptionsPlugin({
      options: {
        stylus: {
          use: [ require('cozy-ui/stylus')() ]
        }
      }
    })
  ]
}
