'use strict'

const CopyPlugin = require('copy-webpack-plugin')

const build = /:production$/.test(process.env.NODE_ENV)

module.exports = {
  plugins: [
    new CopyPlugin([
      { from: 'vendor/assets', ignore: ['.gitkeep'] }
    ])
  ]
}
