'use strict'

const path = require('path')
const { DefinePlugin, ProvidePlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function(production, app) {
  return {
    entry: {
      app: [
        path.resolve(__dirname, 'expose-react.js'),
        path.resolve(__dirname, `../targets/${app}/mobile/main`)
      ]
    },

    output: {
      path: path.resolve(__dirname, `../targets/${app}/mobile/www`),
      filename: '[name].js',
      publicPath: process.env.PUBLIC_PATH
    },
    module: {
      rules: [
        {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: `[name].[ext]`
          }
        },
        {
          test: require.resolve('cozy-bar/dist/cozy-bar.mobile.js')
        }
      ]
    },
    plugins: [
      new DefinePlugin({
        __ALLOW_HTTP__: !production,
        __TARGET__: JSON.stringify('mobile')
      }),
      new ProvidePlugin({
        PouchDB: 'pouchdb',
        pouchdbFind: 'pouchdb-find',
        pouchdbAdapterCordovaSqlite: 'pouchdb-adapter-cordova-sqlite',
        'cozy.client': production
          ? 'cozy-client-js/dist/cozy-client.min.js'
          : 'cozy-client-js/dist/cozy-client.js',
        'cozy.bar': production
          ? 'cozy-bar/dist/cozy-bar.mobile.min.js'
          : 'cozy-bar/dist/cozy-bar.mobile.js'
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
  }
}
