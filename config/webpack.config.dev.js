'use strict'

const { DefinePlugin, ProvidePlugin } = require('webpack')

module.exports = {
  devtool: '#source-map',
  externals: ['cozy'],
  module: {
    rules: [{
      test: require.resolve('cozy-bar/dist/cozy-bar.js'),
      loader: 'imports-loader?css=./cozy-bar.css'
    }]
  },
  plugins: [
    new DefinePlugin({
      __STACK_ASSETS__: false,
      __DEVELOPMENT__: true,
      __PIWIK_SITEID__: 8,
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://piwik.cozycloud.cc')
    }),
    new ProvidePlugin({
      'cozy.client': 'cozy-client-js/dist/cozy-client.js',
      'cozy.bar': 'cozy-bar/dist/cozy-bar.js'
    })
  ]
}
