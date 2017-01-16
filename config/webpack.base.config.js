'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pkg = require(path.resolve(__dirname, '../package.json'))

const build = process.env.NODE_ENV === 'production'

module.exports = {
  entry: path.resolve(__dirname, '../src/main'),
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: build ? 'app.[hash].js' : 'app.js'
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
  devtool: build ? '#cheap-module-source-map' : 'eval',
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
      template: 'src/index.ejs',
      title: pkg.name,
      inject: false,
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}
