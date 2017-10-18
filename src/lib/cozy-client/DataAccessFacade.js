/* global cozy */
import CozyStackAdapter from './adapters/CozyStackAdapter'
import PouchdbAdapter from './adapters/PouchdbAdapter'

const isOnline = () =>
  typeof navigator !== 'undefined' ? navigator.onLine : true
const isOffline = () => !isOnline()

export default class DataAccessFacade {
  constructor() {
    this.stackAdapter = new CozyStackAdapter()
    this.pouchAdapter = new PouchdbAdapter()
    // TODO: strategy injection
    this.strategy = new PouchFirstStrategy()
  }

  setup(cozyUrl, options) {
    const config = { cozyURL: cozyUrl, ...options }
    cozy.client.init(config) // TODO: For now we let cozy-client-js creates PouchDB instances
    if (config.offline) {
      this.pouchAdapter.registerDoctypes(config.offline.doctypes)
    }
  }

  getAdapter(doctype) {
    return this.strategy.getAdapter(
      doctype,
      this.stackAdapter,
      this.pouchAdapter
    )
  }

  startSync(dispatch) {
    return this.pouchAdapter.sync(dispatch)
  }
}

class PouchFirstStrategy {
  getAdapter(doctype, stackAdapter, pouchAdapter) {
    if (pouchAdapter.getDatabase(doctype) === undefined) {
      return stackAdapter
    }
    return pouchAdapter
  }
}

class OfflineStrategy {
  getAdapter(doctype, stackAdapter, pouchAdapter) {
    if (isOffline()) {
      if (pouchAdapter.getDatabase(doctype) === undefined) {
        throw `${doctype} documents cannot be accessed when offline`
      }
      return pouchAdapter
    }
    return stackAdapter
  }
}
