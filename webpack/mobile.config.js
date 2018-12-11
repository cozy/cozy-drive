const { ProvidePlugin } = require('webpack')

module.exports = {
  plugins: [
    new ProvidePlugin({
      PouchDB: 'pouchdb',
      pouchdbFind: 'pouchdb-find',
      pouchdbAdapterCordovaSqlite: 'pouchdb-adapter-cordova-sqlite'
    })
  ]
}
