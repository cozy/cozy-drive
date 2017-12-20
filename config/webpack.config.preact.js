'use strict'

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules\/(?!(cozy-ui))/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.jsx'],
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      'create-react-class': 'preact-compat/lib/create-react-class'
    }
  }
}
