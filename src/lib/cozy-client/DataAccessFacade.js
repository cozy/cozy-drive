/* global cozy, PouchDB */
import CozyStackAdapter from './adapters/CozyStackAdapter'
import PouchdbAdapter, {
  SYNC_BIDIRECTIONAL,
  SYNC_TO,
  SYNC_FROM
} from './adapters/PouchdbAdapter'

// const isOnline = () =>
//   typeof navigator !== 'undefined' ? navigator.onLine : true

export default class DataAccessFacade {
  constructor() {
    this.stackAdapter = new CozyStackAdapter()
    if (typeof PouchDB !== 'undefined') {
      this.pouchAdapter = new PouchdbAdapter()
      // TODO: strategy injection
      this.strategy = new PouchFirstStrategy()
    } else {
      this.strategy = new StackOnlyStrategy()
    }
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
    return this.pouchAdapter.sync(dispatch, SYNC_BIDIRECTIONAL)
  }

  startReplicationTo(dispatch) {
    return this.pouchAdapter.sync(dispatch, SYNC_TO)
  }

  startReplicationFrom(dispatch) {
    return this.pouchAdapter.sync(dispatch, SYNC_FROM)
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

class StackOnlyStrategy {
  getAdapter(doctype, stackAdapter, pouchAdapter) {
    return stackAdapter
  }
}

// class OfflineStrategy {
//   getAdapter(doctype, stackAdapter, pouchAdapter) {
//     if (isOffline()) {
//       if (pouchAdapter.getDatabase(doctype) === undefined) {
//         throw `${doctype} documents cannot be accessed when offline`
//       }
//       return pouchAdapter
//     }
//     return stackAdapter
//   }
// }
