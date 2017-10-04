'use strict'

const { IgnorePlugin } = require('webpack')

module.exports = {
  plugins: [new IgnorePlugin(/^\.\.\/contexts/)]
}
