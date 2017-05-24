'use strict'

const webpack = require('webpack')

module.exports = {
  devtool: '#source-map',
  externals: ['cozy'],
  module: {
    loaders: [{
      test: require.resolve('cozy-bar/dist/cozy-bar.js'),
      loader: 'imports?css=./cozy-bar.css'
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __STACK_ASSETS__: false,
      __PIWIK_SITEID__: 8,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://piwik.cozycloud.cc')
    }),
    new webpack.ProvidePlugin({
      'cozy.client': 'cozy-client-js/dist/cozy-client.js',
      'cozy.bar': 'cozy-bar/dist/cozy-bar.js'
    })
  ]
}
