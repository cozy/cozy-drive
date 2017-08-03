'use strict'

const { extractor } = require('./webpack.vars')

module.exports = {
  module: {
    rules: [
      {
        test: /\.styl$/,
        include: /(cozy-ui\/react)/,
        loader: extractor.extract({
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
                plugins: function () {
                  return [ require('autoprefixer')({ browsers: ['last 2 versions'] }) ]
                }
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  }
}
