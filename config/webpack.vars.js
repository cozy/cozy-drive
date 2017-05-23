'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const production = /:production$/.test(process.env.NODE_ENV)
const target = process.env.NODE_ENV.match(/^(\w+):/)[1]

module.exports = {
  production: production,
  target: target,
  extractor: new ExtractTextPlugin(`[name]${production ? '.[hash].min' : ''}.css`)
}
