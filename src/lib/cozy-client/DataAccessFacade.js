/* global cozy */
import CozyStackAdapter from './adapters/CozyStackAdapter'
import PouchdbAdapter, {
  SYNC_BIDIRECTIONAL,
  SYNC_TO,
  SYNC_FROM
} from './adapters/PouchdbAdapter'

const FILES_DOCTYPE = 'io.cozy.files'

// const isOnline = () =>
//   typeof navigator !== 'undefined' ? navigator.onLine : true

export default class DataAccessFacade {
  constructor() {
    this.url = null
    this.stackAdapter = new CozyStackAdapter()
    this.pouchAdapter = new PouchdbAdapter()
  }

  setup(cozyURL, options) {
    this.url = cozyURL
    const { offline } = options

    // TODO: For now we let cozy-client-js handle offline for files so that we don't break cozy-drive
    const hasFilesDoctype =
      offline && offline.doctypes && offline.doctypes.includes(FILES_DOCTYPE)

    const config = {
      ...options,
      cozyURL,
      offline: hasFilesDoctype ? { doctypes: [FILES_DOCTYPE] } : offline
    }

    // TODO: Get rid of cozy-client-js
    cozy.client.init(config)
    if (offline && offline.doctypes) {
      this.pouchAdapter.registerDoctypes(offline.doctypes)
      // TODO: strategy injection
      this.strategy = new PouchFirstStrategy()
    } else {
      this.strategy = new StackOnlyStrategy()
    }
  }

  getUrl() {
    return this.url
  }

  getAdapter(doctype) {
    return this.strategy.getAdapter(
      doctype,
      this.stackAdapter,
      this.pouchAdapter
    )
  }

  startSync(dispatch) {
    return this.pouchAdapter.startSync(dispatch, SYNC_BIDIRECTIONAL)
  }

  startReplicationTo(dispatch) {
    return this.pouchAdapter.startSync(dispatch, SYNC_TO)
  }

  startReplicationFrom(dispatch) {
    return this.pouchAdapter.startSync(dispatch, SYNC_FROM)
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
