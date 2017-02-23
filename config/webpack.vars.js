'use strict'

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const production = process.env.NODE_ENV === 'production'

module.exports = {
  production: production,
  extractor: new ExtractTextPlugin(`app${production ? '.[hash].min' : ''}.css`)
}
