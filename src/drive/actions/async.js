/* global cozy */
import { isCordova } from '../mobile/lib/device'
import { TRASH_DIR_ID } from '../constants/config.js'

class Stack {
  getFolder = async folderId => {
    const folder = await cozy.client.files.statById(folderId, false, {
      limit: 30
    })
    const parentId = folder.attributes.dir_id
    const parent =
      !!parentId &&
      (await cozy.client.files.statById(parentId).catch(ex => {
        if (ex.status === 403) {
          console.warn("User don't have access to parent folder")
        } else {
          throw ex
        }
      }))

    const files =
      folder.relations('contents').filter(f => f !== undefined) || []
    return {
      ...extractFileAttributes(folder),
      contents: {
        data: files.map(f => extractFileAttributes(f)),
        meta: {
          count: folder.relationships.contents.meta.count
        }
      },
      parent: !!parent && extractFileAttributes(parent)
    }
  }

  getFolderContents = async (folderId, skip = 0, limit = 30) => {
    const folder = await cozy.client.files.statById(folderId, false, {
      skip,
      limit
    })
    // folder.relations('contents') returns null when the trash is empty
    // the filter call is a temporary fix due to a cozy-client-js bug
    const files =
      folder.relations('contents').filter(f => f !== undefined) || []
    return files.map(c => extractFileAttributes(c))
  }

  getSortedFolder = async (
    folderId,
    sortAttribute,
    sortOrder = 'asc',
    skip = 0,
    limit = 30
  ) => {
    const index = await cozy.client.data.defineIndex('io.cozy.files', [
      sortAttribute
    ])
    const resp = await cozy.client.files.query(index, {
      selector: {
        dir_id: folderId
      },
      sort: [{ [sortAttribute]: sortOrder }],
      skip,
      limit,
      wholeResponse: true
    })
    const items = resp.data
      .filter(f => f.attributes.name !== '.cozy_trash') // this query returns the trash folder without an ID...
      .map(f => extractFileAttributes(f))
    if (sortAttribute === 'updated_at') {
      return items
    }
    // Sadly CouchDB only supports a single sort direction for all fields,
    // so we can't sort by type to separate folders and files and have to
    // do it by hand
    const folders = items.reduce(
      (acc, f) => (f.type === 'directory' ? [...acc, f] : acc),
      []
    )
    const files = items.reduce(
      (acc, f) => (f.type !== 'directory' ? [...acc, f] : acc),
      []
    )
    return [...folders, ...files]
  }

  RECENT_FILES_INDEX_FIELDS = ['updated_at', 'trashed']
  RECENT_FILES_QUERY_OPTIONS = {
    selector: {
      updated_at: { $gt: null },
      trashed: false
    },
    sort: [{ updated_at: 'desc' }],
    limit: 30
  }

  getRecentFiles = async () => {
    const index = await cozy.client.data.defineIndex(
      'io.cozy.files',
      this.RECENT_FILES_INDEX_FIELDS
    )
    const resp = await cozy.client.files.query(index, {
      ...this.RECENT_FILES_QUERY_OPTIONS,
      wholeResponse: true
    })
    return resp.data.map(f => ({
      ...f,
      _id: f.id,
      _type: f.type,
      ...f.attributes
    }))
  }

  getFilesInBatch = ids =>
    cozy.client.fetchJSON(
      'POST',
      '/data/io.cozy.files/_all_docs?include_docs=true',
      { keys: ids }
    )
}

class PouchDB {
  constructor({ folder, recent }) {
    this.folderIdex = folder
    this.recentIndex = recent
  }

  getFolder = async folderId => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const folder = await db.get(folderId)
    const parent = !!folder.dir_id && (await db.get(folder.dir_id))
    const files = await this.getFolderContents(folderId)
    return {
      ...normalizeFileFromPouchDB(folder),
      contents: {
        data: files,
        meta: {}
      },
      parent: !!parent && normalizeFileFromPouchDB(parent)
    }
  }

  getFolderContents = async (folderId, skip = 0, limit = 30) => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const resp = await db.find({
      selector: {
        dir_id: folderId,
        name: { $gte: null },
        type: { $gte: null }
      },
      use_index: this.folderIdex,
      sort: ['dir_id', { type: 'desc' }, { name: 'desc' }],
      limit,
      skip
    })
    const files = resp.docs
      .filter(f => f._id !== TRASH_DIR_ID)
      .map(f => normalizeFileFromPouchDB(f))
    return files
  }

  getSortedFolder = () => {
    // TODO
  }

  getRecentFiles = async () => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const files = await db.query(this.recentIndex, {
      limit: 30,
      include_docs: true,
      descending: true
    })
    return files.rows.map(f => ({
      ...f.doc,
      id: f.id,
      _type: 'io.cozy.files'
    }))
  }

  getFilesInBatch = ids => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    return db.allDocs({
      include_docs: true,
      keys: ids
    })
  }
}

const memoize = fn => {
  let res
  return (...args) => {
    if (typeof res === 'undefined') {
      res = fn(...args)
    }
    return res
  }
}

export const getAdapter = memoize(
  state =>
    shouldWorkFromPouchDB(state)
      ? new PouchDB(state.settings.indexes)
      : new Stack()
)

const shouldWorkFromPouchDB = state => {
  const settings = state.settings
  return (
    isCordova() &&
    settings.offline &&
    settings.firstReplication &&
    settings.indexes
  )
}

export const extractFileAttributes = f => {
  const id = f.id || f._id
  return {
    ...f.attributes,
    id,
    _id: id,
    _type: 'io.cozy.files',
    links: f.links,
    relationships: f.relationships
  }
}

const normalizeFileFromPouchDB = f => ({
  ...f,
  id: f._id,
  _type: 'io.cozy.files'
})
