'use strict'

const merge = require('webpack-merge')

module.exports = function(env) {
  const { target = 'browser', app = 'drive' } = env
  const production = env.production === true
  return merge(
    require('./config/webpack.config.base')(production),
    require('./config/webpack.config.disable-contexts'),
    require('./config/webpack.config.preact'),
    require('./config/webpack.config.cozy-ui'),
    require('./config/webpack.config.pictures')(production),
    require('./config/webpack.config.vendors'),
    require('./config/webpack.config.manifest')(production),
    require(`./config/webpack.target.${target}`)(production, app),
    require(production ? './config/webpack.config.prod' : './config/webpack.config.dev')
  )
}
