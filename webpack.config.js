'use strict'

const merge = require('webpack-merge')

const build = /:production$/.test(process.env.NODE_ENV)
const target = process.env.NODE_ENV.match(/^(\w+):/)[1]

const common = merge(
  require('./config/webpack.base.config'),
  require('./config/webpack.disable-contexts.config'),
  require('./config/webpack.preact.config'),
  require('./config/webpack.cozy-ui.config'),
  require('./config/webpack.pictures.config'),
  require('./config/webpack.copyfiles.config'),
  require(`./config/webpack.${target}.target`)
)

if (build) {
  module.exports = merge(
    common,
    require('./config/webpack.prod.config')
  )
} else {
  module.exports = common
}
