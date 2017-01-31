'use strict'

const build = /production$/.test(process.env.NODE_ENV)

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
        exclude: /(vendor|sprites|icons)/,
        loader: `file?path=img&name=[name]${build ? '.[hash].' : '.'}[ext]`
      }
    ]
  }
}
