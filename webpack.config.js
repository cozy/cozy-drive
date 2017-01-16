'use strict'

const merge = require('webpack-merge')

const build = process.env.NODE_ENV === 'production'

const common = merge(
  require('./config/webpack.base.config'),
  require('./config/webpack.disable-contexts.config'),
  require('./config/webpack.preact.config'),
  require('./config/webpack.cozy-ui.config'),
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
