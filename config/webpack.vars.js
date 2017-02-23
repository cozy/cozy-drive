'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const production = /:production$/.test(process.env.NODE_ENV)

module.exports = {
  production: production,
  extractor: new ExtractTextPlugin(`app${production ? '.[hash].min' : ''}.css`)
}
