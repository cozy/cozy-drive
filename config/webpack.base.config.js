'use strict'

const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const pkg = require(path.resolve(__dirname, '../package.json'))

const build = /production$/.test(process.env.NODE_ENV)
const mobile = /^mobile/.test(process.env.NODE_ENV)
const outputFolder = mobile ? 'mobile/www' : 'build'
const entryFolder = mobile ? 'mobile/src' : 'src'

module.exports = {
  entry: path.resolve(__dirname, '..', entryFolder, 'main'),
  output: {
    path: path.resolve(__dirname, '..', outputFolder),
    filename: build ? 'app.[hash].js' : 'app.js'
  },
  resolve: {
    extensions: ['', '.js', '.json', '.css']
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
      template: path.resolve(__dirname, '..', entryFolder, 'index.ejs'),
      title: pkg.name,
      inject: false,
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}
