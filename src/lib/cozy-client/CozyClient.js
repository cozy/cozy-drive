/* global cozy */
import DataAccessFacade from './DataAccessFacade'
import { authenticateWithCordova } from './authentication/mobile'

const FILES_DOCTYPE = 'io.cozy.files'
const SHARINGS_DOCTYPE = 'io.cozy.sharings'

export default class CozyClient {
  constructor(config) {
    const { cozyURL, ...options } = config
    this.options = options
    this.indexes = {}
    this.specialDirectories = {}
    this.facade = new DataAccessFacade()
    if (cozyURL) {
      this.facade.setup(cozyURL, options)
    }
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

  async isRegistered(clientInfos) {
    if (!clientInfos) return false
    try {
      await cozy.client.auth.getClient(clientInfos)
      return true
    } catch (err) {
      // this is the error sent if we are offline
      if (err.message === 'Failed to fetch') {
        return true
      } else {
        console.warn(err)
        return false
      }
    }
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

  async fetchCollection(name, doctype, options = {}, skip = 0) {
    if (options.selector) {
      const index = await this.getCollectionIndex(name, doctype, options)
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

  deleteDocument(doc) {
    return this.getAdapter(doc._type).deleteDocument(doc)
  }

  async fetchSharings(doctype) {
    const permissions = await this.getAdapter(doctype).fetchSharingPermissions(
      doctype
    )
    const sharingIds = [
      ...permissions.byMe.map(p => p.attributes.source_id),
      ...permissions.withMe.map(p => p.attributes.source_id)
    ]
    const sharings = await Promise.all(
      sharingIds.map(id => this.getAdapter(SHARINGS_DOCTYPE).fetchSharing(id))
    )
    return { permissions, sharings }
  }

  createSharing(permissions, contactIds, sharingType, description) {
    return this.getAdapter(SHARINGS_DOCTYPE).createSharing(
      permissions,
      contactIds,
      sharingType,
      description
    )
  }

  revokeSharing(sharingId) {
    return this.getAdapter(SHARINGS_DOCTYPE).revokeSharing(sharingId)
  }

  revokeSharingForClient(sharingId, clientId) {
    return this.getAdapter(SHARINGS_DOCTYPE).revokeSharingForClient(
      sharingId,
      clientId
    )
  }

  createSharingLink(permissions) {
    return this.getAdapter(SHARINGS_DOCTYPE).createSharingLink(permissions)
  }

  revokeSharingLink(permission) {
    return this.getAdapter(SHARINGS_DOCTYPE).revokeSharingLink(permission)
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

  async getCollectionIndex(name, doctype, options) {
    if (!this.indexes[name]) {
      this.indexes[name] = await this.getAdapter(doctype).createIndex(
        doctype,
        this.getIndexFields(options)
      )
    }
    return this.indexes[name]
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

  getIndexFields(options) {
    const { selector, sort } = options
    if (sort) {
      // We filter possible duplicated fields
      return [...Object.keys(selector), ...Object.keys(sort)].filter(
        (f, i, arr) => arr.indexOf(f) === i
      )
    }
    return Object.keys(selector)
  }
}
