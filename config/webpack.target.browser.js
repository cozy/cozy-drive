'use strict'

const path = require('path')
const { DefinePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(production, app) {
  return {
    entry: {
      app: path.resolve(__dirname, `../targets/${app}/web/main`),
      services: path.resolve(__dirname, `../targets/${app}/web/services`),
      'public/app': path.resolve(__dirname, `../targets/${app}/web/public/main`)
    },
    output: {
      path: path.resolve(__dirname, `../build/${app}`),
      filename: '[name].js'
    },
    externals: {
      'cozy-client-js': 'cozy'
    },
    plugins: [
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
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `../targets/${app}/web/services.ejs`),
        title: `cozy-${app}`,
        filename: 'services.html',
        chunks: ['services'],
        inject: 'head',
        minify: {
          collapseWhitespace: true
        }
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `../targets/${app}/web/public/index.ejs`),
        title: `cozy-${app}`,
        filename: 'public/index.html',
        chunks: ['public/app'],
        inject: 'head',
        minify: {
          collapseWhitespace: true
        }
      })
    ]
  }
}
