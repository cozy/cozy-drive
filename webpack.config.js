'use strict'

const merge = require('webpack-merge')
const { production } = require('./config/webpack.vars')

module.exports = merge(
  require('./config/webpack.config.base'),
  require('./config/webpack.config.disable-contexts'),
  require('./config/webpack.config.preact'),
  require('./config/webpack.config.cozy-ui'),
  require('./config/webpack.config.pictures'),
  require('./config/webpack.config.copy-files'),
  require(production ? './config/webpack.config.prod' : './config/webpack.config.dev')
)
