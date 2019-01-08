const { ProvidePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new ProvidePlugin({
      PouchDB: 'pouchdb',
      pouchdbFind: 'pouchdb-find',
      pouchdbAdapterCordovaSqlite: 'pouchdb-adapter-cordova-sqlite'
    }),
    new CopyPlugin([
      {
        from: 'src/drive/mobile/assets/fonts/',
        to: 'app/'
      }
    ])
  ]
}
