'use strict'

const path = require('path')

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules\/(?!(cozy-ui|cozy-client))/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.jsx'],
    // necessary so that webpack looks into node_modules for preact-compat when importing cozy-client
    modules: [path.resolve('./node_modules')],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class'
    }
  }
}
