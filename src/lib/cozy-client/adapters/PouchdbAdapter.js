/* global cozy */
import PouchDB from 'pouchdb'
import pouchdbFind from 'pouchdb-find'
import {
  startDoctypeSync,
  syncDoctypeOk,
  syncDoctypeError
} from '../slices/synchronization'

const REPLICATION_INTERVAL = 30000
export const SYNC_BIDIRECTIONAL = 'SYNC_BIDIRECTIONAL'
export const SYNC_TO = 'SYNC_TO'
export const SYNC_FROM = 'SYNC_FROM'

export default class PouchdbAdapter {
  constructor() {
    PouchDB.plugin(pouchdbFind)
    this.instances = {}
    this.doctypes = []
    this.replicationBaseUrl = null
  }

  registerDoctypes(doctypes) {
    this.doctypes = doctypes
    for (let doctype of this.doctypes) {
      this.instances[doctype] = new PouchDB(doctype)
    }
  }

  getDatabase(doctype) {
    return this.instances[doctype]
  }

  getReplicationBaseUrl() {
    return cozy.client.authorize().then(credentials => {
      const basic = credentials.token.toBasicAuth()
      return `${cozy.client._url}/data/`.replace('//', `//${basic}`)
    })
  }

  getSeqNumber(doctype) {
    return this.getDatabase(doctype)
      .info()
      .then(result => result.update_seq)
  }

  async startSync(dispatch, direction = SYNC_BIDIRECTIONAL) {
    try {
      const infos = await this.sync(dispatch, direction)
      this.scheduleNextSync(dispatch, direction)
      return infos
    } catch (err) {
      this.scheduleNextSync(dispatch, direction)
      throw err
    }
  }

  sync(dispatch, direction) {
    return this.getReplicationBaseUrl().then(baseUrl =>
      Promise.all(
        this.doctypes.map(doctype =>
          this.syncDoctype(doctype, `${baseUrl}${doctype}`, dispatch, direction)
        )
      )
    )
  }

  async syncDoctype(doctype, replicationUrl, dispatch, direction) {
    try {
      const seqNumber = await this.getSeqNumber(doctype)
      dispatch(startDoctypeSync(doctype, seqNumber))
      const syncInfos = await this.syncDatabase(
        doctype,
        replicationUrl,
        direction
      )
      dispatch(syncDoctypeOk(doctype, syncInfos))
      return syncInfos
    } catch (syncError) {
      dispatch(syncDoctypeError(doctype, syncError))
      throw syncError
    }
  }

  syncDatabase(doctype, replicationUrl, direction) {
    return new Promise((resolve, reject) => {
      const db = this.getDatabase(doctype)

      let syncHandler
      if (direction === SYNC_TO) syncHandler = db.replicate.to(replicationUrl)
      else if (direction === SYNC_FROM)
        syncHandler = db.replicate.from(replicationUrl)
      else syncHandler = db.sync(replicationUrl)

      syncHandler.on('complete', info => resolve(info)).on('error', err => {
        if (err.error === 'code=400, message=Expired token') {
          return cozy.client.authorize().then(({ client, token }) => {
            cozy.client.auth
              .refreshToken(client, token)
              .then(newToken => cozy.client.saveCredentials(client, newToken))
              .then(credentials => reject(err))
          })
        } else if (err.status !== 404) {
          // A 404 error on some doctypes is perfectly normal when there is no data
          reject(err)
        }
      })
    })
  }

  scheduleNextSync(dispatch, direction) {
    setTimeout(() => {
      this.sync(dispatch, direction)
    }, REPLICATION_INTERVAL)
  }

  async fetchDocuments(doctype) {
    const resp = await this.getDatabase(doctype).allDocs({ include_docs: true })
    return {
      data: resp.rows
        .filter(row => !row.doc.hasOwnProperty('views'))
        .map(row => ({ ...row.doc, id: row.id, _type: doctype })),
      meta: { count: resp.total_rows },
      skip: resp.offset,
      next: false
    }
  }

  async queryDocuments(doctype, index, options) {
    const queryOptions = {
      ...options,
      fields: [...options.fields, '_id'],
      sort: options.sort
        ? Object.keys(options.sort).map(k => ({ [k]: options.sort[k] }))
        : undefined
    }
    const resp = await this.getDatabase(doctype).find(queryOptions)

    return {
      data: resp.docs.map(doc => ({ ...doc, id: doc._id, _type: doctype })),
      meta: { count: resp.docs.length },
      skip: 0,
      next: false
    }
  }

  async fetchDocument(doctype, id) {
    const resp = await this.getDatabase(doctype).get(id, { revs_info: true }) // We need the revs_info option to get the _rev property
    return { data: [{ ...resp, id: resp.id, _id: resp.id, _type: doctype }] }
  }

  async createDocument(doctype, doc) {
    const resp = await this.getDatabase(doctype).post(doc)
    return {
      data: [
        { ...doc, id: resp.id, _id: resp.id, _type: doctype, _rev: resp.rev }
      ]
    }
  }

  async updateDocument(doc) {
    // TODO: _* properties are reserved by CouchDB, so we can't send the doc with its _type property...
    const { _type, ...safeDoc } = doc
    const resp = await this.getDatabase(_type).put(safeDoc)
    return { data: [{ ...doc, _rev: resp.rev }] }
  }

  async deleteDocument(doc) {
    await this.getDatabase(doc._type).remove(doc)
    return { data: [doc] }
  }

  createIndex(doctype, fields) {
    return this.getDatabase(doctype).createIndex({ index: { fields } })
  }

  fetchFileByPath(path) {
    throw new Error('Not implemented')
  }

  createFile(file, dirID) {
    throw new Error('Not implemented')
  }

  trashFile(file) {
    throw new Error('Not implemented')
  }

  fetchReferencedFiles(doc, skip = 0) {
    throw new Error('Not implemented')
  }

  addReferencedFiles(doc, ids) {
    throw new Error('Not implemented')
  }

  removeReferencedFiles(doc, ids) {
    throw new Error('Not implemented')
  }
}
