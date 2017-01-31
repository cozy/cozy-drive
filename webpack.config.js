'use strict'

const merge = require('webpack-merge')

const build = /production$/.test(process.env.NODE_ENV)

const common = merge(
  require('./config/webpack.base.config'),
  require('./config/webpack.disable-contexts.config'),
  require('./config/webpack.preact.config'),
  require('./config/webpack.cozyui.config'),
  require('./config/webpack.pictures.config'),
  require('./config/webpack.copyfiles.config')
)

if (build) {
  module.exports = merge(
    common,
    require('./config/webpack.prod.config')
  )
} else {
  module.exports = common
}
