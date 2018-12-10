const { ProvidePlugin } = require('webpack')
const { environment } = require('cozy-scripts/config/webpack.vars')

const production = environment === 'production'

module.exports = {
  module: {
    rules: [
      {
          test: /\.(eot|ttf|woff|woff2)$/,
          loader: 'file-loader',
          options: {
            name: `[name].[ext]`
          }
      }
    ]
  },
  plugins: [
    new ProvidePlugin({
      PouchDB: 'pouchdb',
      pouchdbFind: 'pouchdb-find',
      pouchdbAdapterCordovaSqlite: 'pouchdb-adapter-cordova-sqlite'
    })
  ]
}
