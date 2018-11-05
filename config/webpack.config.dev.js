'use strict'

const { DefinePlugin, ProvidePlugin } = require('webpack')

const path = require('path')
const pkg = require(path.resolve(__dirname, '../package.json'))

module.exports = {
  devtool: 'cheap-module-source-map',
  externals: ['cozy'],
  module: {
    rules: [
      {
        test: require.resolve('cozy-bar/dist/cozy-bar.js'),
        loader: 'imports-loader?css=./cozy-bar.css'
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      __STACK_ASSETS__: false,
      __DEVELOPMENT__: true,
      __PIWIK_SITEID__: 8,
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://matomo.cozycloud.cc'),
      __SENTRY_URL__: JSON.stringify('https://29bd1255b6d544a1b65435a634c9ff67@sentry.cozycloud.cc/2'),
      __APP_VERSION__: JSON.stringify(pkg.version)
    }),
    new ProvidePlugin({
      'cozy.client': 'cozy-client-js/dist/cozy-client.js',
      'cozy.bar': 'cozy-bar/dist/cozy-bar.js'
    })
  ]
}
