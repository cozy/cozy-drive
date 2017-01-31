'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pkg = require(path.resolve(__dirname, '../package.json'))

module.exports = {
  output: {
    filename: 'app.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  devtool: 'eval',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?importLoaders=1',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', entryFolder, 'index.ejs'),
      title: pkg.name,
      inject: false,
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}
