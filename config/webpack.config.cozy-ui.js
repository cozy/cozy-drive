'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

const SRC_DIR = path.resolve(__dirname, '../src')

module.exports = production => ({
  resolve: {
    modules: ['node_modules', SRC_DIR],
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
                sourceMap: !production,
                importLoaders: 1,
                modules: true,
                localIdentName: '[local]--[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: !production,
                plugins: () => [
                  require('autoprefixer')({ browsers: ['last 2 versions'] })
                ]
              }
            },
            {
              loader: 'stylus-loader',
              options: {
                sourceMap: !production,
                use: [require('cozy-ui/stylus')()]
              }
            }
          ]
        })
      }
    ]
  }
})
