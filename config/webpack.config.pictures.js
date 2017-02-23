'use strict'

const {production} = require('./webpack.vars')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.svg$/,
        include: /(sprites|icons)/,
        loader: 'svg-sprite?name=[name]_[hash]'
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        exclude: /(sprites|icons)/,
        loader: `file?path=img&name=[name]${production ? '.[hash]' : ''}.[ext]`
      }
    ]
  }
}
