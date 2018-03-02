/* global cozy */
import DataAccessFacade from './DataAccessFacade'
import SharingsCollection, {
  SHARINGS_DOCTYPE
} from './collections/SharingsCollection'
import AppsCollection, { APPS_DOCTYPE } from './collections/AppsCollection'
import { authenticateWithCordova } from './authentication/mobile'
import { getIndexFields, isV2 as isV2Helper } from './helpers'

const FILES_DOCTYPE = 'io.cozy.files'

export default class CozyClient {
  constructor(config) {
    const { cozyURL, ...options } = config
    this.options = options
    this.collections = {}
    this.indexes = {}
    this.specialDirectories = {}
    this.facade = new DataAccessFacade()
    this.store = null
    if (cozyURL) {
      this.facade.setup(cozyURL, options)
    }
    this.defineSpecialCollections()
  }

  register(cozyUrl) {
    this.facade.setup(cozyUrl, {
      ...this.options,
      oauth: {
        ...this.options.oauth,
        onRegistered: (client, url) => authenticateWithCordova(url)
      }
    })
    return cozy.client.authorize(true)
  }

  attachStore(store) {
    this.store = store
  }

  resetStore() {
    this.store.dispatch({ type: 'RESET_STORE' })
    this.facade.destroyAllDatabases()
  }

  getUrl() {
    return this.facade.getUrl()
  }

  isV2(cozyURL) {
    return isV2Helper(cozyURL)
  }

  async isRegistered(clientInfos) {
    if (!clientInfos) return false
    try {
      await cozy.client.auth.getClient(clientInfos)
      return true
    } catch (err) {
      if (err.message === 'Client has been revoked') {
        return false
      } else {
        console.log(
          'Error while retrieving oauth client information, but client is not revoked'
        )
        console.warn(err)
        return true
      }
    }
  }

  defineCollection(doctype, collectionAdapter) {
    this.collections[doctype] = collectionAdapter
  }

  defineSpecialCollections() {
    this.defineCollection(SHARINGS_DOCTYPE, new SharingsCollection())
    this.defineCollection(APPS_DOCTYPE, new AppsCollection())
  }

  getCollection(doctype) {
    if (!this.collections[doctype]) {
      throw new Error(`No collection found for doctype ${doctype}`)
    }
    return this.collections[doctype]
  }

  startSync(dispatch) {
    return this.facade.startSync(dispatch)
  }

  startReplicationTo(dispatch) {
    return this.facade.startReplicationTo(dispatch)
  }

  startReplicationFrom(dispatch) {
    return this.facade.startReplicationFrom(dispatch)
  }

  getAdapter(doctype) {
    return this.facade.getAdapter(doctype)
  }

  async fetchDocuments(queryName, doctype, options = {}, skip = 0) {
    if (options.selector) {
      const index = await this.getQueryIndex(queryName, doctype, options)
      return this.getAdapter(doctype).queryDocuments(doctype, index, {
        ...options,
        skip
      })
    }
    return this.getAdapter(doctype).fetchDocuments(doctype)
  }

  fetchDocument(doctype, id) {
    return this.getAdapter(doctype).fetchDocument(doctype, id)
  }

  fetchFile(id) {
    return this.getAdapter(FILES_DOCTYPE).fetchFile(id)
  }

  // TODO: temp method for drive mobile so that we can fetch the thumbnails links
  // that are absent from the Pouch docs
  fetchFilesForLinks(folderId, skip = 0) {
    return this.facade.stackAdapter.fetchFilesForLinks(folderId, skip)
  }

  fetchReferencedFiles(doc, skip = 0) {
    return this.getAdapter(doc._type).fetchReferencedFiles(doc, skip)
  }

  addReferencedFiles(doc, ids) {
    return this.getAdapter(doc._type).addReferencedFiles(doc, ids)
  }

  removeReferencedFiles(doc, ids) {
    return this.getAdapter(doc._type).removeReferencedFiles(doc, ids)
  }

  createDocument(doctype, doc) {
    return this.getAdapter(doctype).createDocument(doctype, doc)
  }

  updateDocument(doc) {
    return this.getAdapter(doc._type).updateDocument(doc)
  }

  /**
   * Update documents in bulk.
   *
   * All documents matching the query will be retrieved before updating.
   *
   * @example
   * ```
   * await dispatch(
   *   updateDocuments(
   *     'io.cozy.bank.transactions',
   *     {
   *       selector: { accountId: '1921680010' }
   *     },
   *     {
   *       updateCollections: ['transactions']
   *     },
   *     transaction => ({ ...transaction, amount: transaction.amount + 10 })
   *   )
   * )
   * ```
   *
   * @param  {String} doctype  - Doctype of the documents that will be updated
   * @param  {Object} query    - Mango query to select which documents will be updated
   * @param  {Function} iterator - Function that will update the documents
   * @return {Promise}
   */
  updateDocuments(doctype, query, iterator) {
    return this.getAdapter(doctype).updateDocuments(doctype, query, iterator)
  }

  deleteDocument(doc) {
    return this.getAdapter(doc._type).deleteDocument(doc)
  }

  /**
   * Delete documents in bulk.
   *
   * All documents matching the query will be retrieved before deleting.
   *
   * @example
   * ```
   * await dispatch(deleteDocuments('io.cozy.bank.operations', {
   *   selector: { account: account.id }
   * }, {
   *   updateCollections: ['transactions']
   * }))
   * ```
   *
   */
  deleteDocuments(doctype, query) {
    return this.getAdapter(doctype).deleteDocuments(doctype, query)
  }

  createFile(file, dirID) {
    return this.getAdapter(FILES_DOCTYPE).createFile(file, dirID)
  }

  trashFile(file) {
    return this.getAdapter(FILES_DOCTYPE).trashFile(file)
  }

  async ensureDirectoryExists(path) {
    if (!this.specialDirectories[path]) {
      const dir = await cozy.client.files.createDirectoryByPath(path)
      this.specialDirectories[path] = dir._id
    }
    return this.specialDirectories[path]
  }

  async checkUniquenessOf(doctype, property, value) {
    const index = await this.getUniqueIndex(doctype, property)
    const existingDocs = await cozy.client.data.query(index, {
      selector: { [property]: value },
      fields: ['_id']
    })
    return existingDocs.length === 0
  }

  async getQueryIndex(queryName, doctype, options) {
    if (!this.indexes[queryName]) {
      this.indexes[queryName] = await this.getAdapter(doctype).createIndex(
        doctype,
        getIndexFields(options)
      )
    }
    return this.indexes[queryName]
  }

  async getUniqueIndex(doctype, property) {
    const name = `${doctype}/${property}`
    if (!this.indexes[name]) {
      this.indexes[name] = await this.getAdapter(doctype).createIndex(doctype, [
        property
      ])
    }
    return this.indexes[name]
  }
}
