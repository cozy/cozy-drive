'use strict'

module.exports = function(production) {
  return {
    module: {
      rules: [
        {
          test: /\.svg$/,
          include: /(sprites|icons)/,
          loader: 'file-loader',
          options: {
            name: `[name]${production ? '.[hash]' : ''}.[ext]`
          }
        },
        {
          test: /\.(png|gif|jpe?g|svg)$/i,
          exclude: /(sprites|icons)/,
          loader: 'file-loader',
          options: {
            outputPath: 'img',
            name: `[name]${production ? '.[hash]' : ''}.[ext]`
          }
        }
      ]
    }
  }
}
