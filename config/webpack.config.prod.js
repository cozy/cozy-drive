'use strict'

const { DefinePlugin, ProvidePlugin, optimize } = require('webpack')

module.exports = {
  output: {
    filename: '[name].[hash].min.js'
  },
  devtool: false,
  plugins: [
    new optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false
      }
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'), // to compile on production mode (redux)
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
      __STACK_ASSETS__: true,
      __PIWIK_SITEID__: 8,
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://piwik.cozycloud.cc')
    }),
    new ProvidePlugin({
      'cozy.client': 'cozy-client-js/dist/cozy-client.js'
    })
  ]
}
