'use strict'

const path = require('path')
const fs = require('fs')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(production, app) {
  var entry = {
    app: path.resolve(__dirname, `../targets/${app}/web/main`)
  }

  var plugins = [
    new DefinePlugin({
      __TARGET__: JSON.stringify('browser')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../targets/${app}/web/index.ejs`),
      title: `cozy-${app}`,
      chunks: ['app'],
      inject: 'head',
      minify: {
        collapseWhitespace: true
      }
    })
  ]

  if (fs.existsSync(path.resolve(__dirname, `../targets/${app}/web/services.jsx`))) {
    entry.services = path.resolve(__dirname, `../targets/${app}/web/services`)
    plugins.push(new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../targets/${app}/web/services.ejs`),
      title: `cozy-${app}`,
      filename: 'services.html',
      chunks: ['services'],
      inject: 'head',
      minify: {
        collapseWhitespace: true
      }
    }))
  }

  if (fs.existsSync(path.resolve(__dirname, `../targets/${app}/web/public/main.jsx`))) {
    entry['public/app'] = path.resolve(__dirname, `../targets/${app}/web/public/main`)
    plugins.push(new HtmlWebpackPlugin({
      template: path.resolve(__dirname, `../targets/${app}/web/public/index.ejs`),
      title: `cozy-${app}`,
      filename: 'public/index.html',
      chunks: ['public/app'],
      inject: 'head',
      minify: {
        collapseWhitespace: true
      }
    }))
  }

  return {
    entry: entry,
    output: {
      path: path.resolve(__dirname, `../build/${app}`),
      filename: '[name].js'
    },
    externals: {
      'cozy-client-js': 'cozy'
    },
    plugins: plugins
  }
}
