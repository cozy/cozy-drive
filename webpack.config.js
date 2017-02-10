'use strict'

const merge = require('webpack-merge')

const build = /:production$/.test(process.env.NODE_ENV)
const target = process.env.NODE_ENV.match(/^(\w+):/)[1]

const common = merge(
  require('./config/webpack.config.base'),
  require('./config/webpack.config.disable-contexts'),
  require('./config/webpack.config.preact'),
  require('./config/webpack.config.cozy-ui'),
  require('./config/webpack.config.pictures'),
  require('./config/webpack.config.vendors'),
  require('./config/webpack.config.manifest'),
  require(`./config/webpack.target.${target}`)
)

if (build) {
  module.exports = merge(
    common,
    require('./config/webpack.config.prod')
  )
} else {
  module.exports = common
}
