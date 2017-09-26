/* global cozy */
import { CozyAPI } from '.'

export default class CozyClient {
  constructor (config) {
    this.indexes = {}
    this.specialDirectories = {}
    this.api = new CozyAPI(config)
  }

  async fetchCollection (name, doctype, options = {}, skip = 0) {
    if (options.selector) {
      const index = await this.getCollectionIndex(name, doctype, options)
      return await this.api.queryDocuments(doctype, index, { ...options, skip })
    }
    return await this.api.fetchDocuments(doctype)
  }

  fetchDocument (doctype, id) {
    return this.api.fetchDocument(doctype, id)
  }

  fetchReferencedFiles (doc, skip = 0) {
    return this.api.fetchReferencedFiles(doc, skip)
  }

  addReferencedFiles (doc, ids) {
    return this.api.addReferencedFiles(doc, ids)
  }

  removeReferencedFiles (doc, ids) {
    return this.api.removeReferencedFiles(doc, ids)
  }

  createDocument (doc) {
    return this.api.createDocument(doc)
  }

  updateDocument (doc) {
    return this.api.updateDocument(doc)
  }

  deleteDocument (doc) {
    return this.api.deleteDocument(doc)
  }

  async fetchSharings (doctype) {
    const permissions = await this.api.fetchSharingPermissions(doctype)
    const sharingIds = [
      ...permissions.byMe.map(p => p.attributes.source_id),
      ...permissions.withMe.map(p => p.attributes.source_id)
    ]
    const sharings = await Promise.all(
      sharingIds.map(id => this.api.fetchSharing(id))
    )
    return { permissions, sharings }
  }

  createSharing (permissions, contactIds, sharingType, description) {
    return this.api.createSharing(
      permissions,
      contactIds,
      sharingType,
      description
    )
  }

  revokeSharing (sharingId) {
    return this.api.revokeSharing(sharingId)
  }

  revokeSharingForClient (sharingId, clientId) {
    return this.api.revokeSharingForClient(sharingId, clientId)
  }

  createSharingLink (permissions) {
    return this.api.createSharingLink(permissions)
  }

  revokeSharingLink (permission) {
    return this.api.revokeSharingLink(permission)
  }

  fetchFile (id) {
    return this.api.fetchFile(id)
  }

  createFile (file, dirID) {
    return this.api.createFile(file, dirID)
  }

  trashFile (file) {
    return this.api.trashFile(file)
  }

  async ensureDirectoryExists (path) {
    if (!this.specialDirectories[path]) {
      const dir = await cozy.client.files.createDirectoryByPath(path)
      this.specialDirectories[path] = dir._id
    }
    return this.specialDirectories[path]
  }

  async checkUniquenessOf (doctype, property, value) {
    const index = await this.getUniqueIndex(doctype, property)
    const existingDocs = await cozy.client.data.query(index, {
      selector: { [property]: value },
      fields: ['_id']
    })
    return existingDocs.length === 0
  }

  async getCollectionIndex (name, doctype, options) {
    if (!this.indexes[name]) {
      this.indexes[name] = await this.api.createIndex(
        doctype,
        this.getIndexFields(options)
      )
    }
    return this.indexes[name]
  }

  async getUniqueIndex (doctype, property) {
    const name = `${doctype}/${property}`
    if (!this.indexes[name]) {
      this.indexes[name] = await this.api.createIndex(doctype, [property])
    }
    return this.indexes[name]
  }

  getIndexFields (options) {
    const { selector, sort } = options
    if (sort) {
      return [...Object.keys(selector), ...Object.keys(sort)]
    }
    return Object.keys(selector)
  }
}
