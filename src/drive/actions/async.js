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
    limit = 30,
    loadedFoldersCount = 0,
    loadedFilesCount = 0
  ) => {
    const shouldSeparateFilesAndFolders = sortAttribute === 'name'
    const index = await cozy.client.data.defineIndex('io.cozy.files', [
      sortAttribute
    ])
    const query = (selector, skipRows = skip) =>
      cozy.client.files
        .query(index, {
          selector,
          sort: [{ [sortAttribute]: sortOrder }],
          skip: skipRows,
          limit,
          wholeResponse: true
        })
        .then(resp => resp.data.map(f => extractFileAttributes(f)))

    if (shouldSeparateFilesAndFolders) {
      const folders = await query({ dir_id: folderId, type: 'directory' })
      const files =
        folders.length < limit
          ? await query(
              { dir_id: folderId, type: { $ne: 'directory' } },
              loadedFilesCount
            )
          : []
      return [
        // this query returns the trash folder without an ID...
        // and we don't want to filter that in the query function because
        // it'll mess with the pagination...
        ...folders.filter(f => f.name !== '.cozy_trash'),
        ...files
      ]
    } else {
      const resp = await query({ dir_id: folderId })
      return resp.filter(f => f.name !== '.cozy_trash')
    }
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
  constructor({ folder, recent, sort }) {
    this.folderIndex = folder
    this.recentIndex = recent
    this.sortIndexes = sort
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
      use_index: this.folderIndex,
      sort: ['dir_id', { type: 'desc' }, { name: 'desc' }],
      limit,
      skip
    })
    const files = resp.docs
      .filter(f => f._id !== TRASH_DIR_ID)
      .map(f => normalizeFileFromPouchDB(f))
    return files
  }

  getSortedFolder = async (
    folderId,
    sortAttribute,
    sortOrder = 'asc',
    skip = 0,
    limit = 30,
    loadedFoldersCount = 0,
    loadedFilesCount = 0
  ) => {
    const index = this.sortIndexes[sortAttribute]
    if (!index) {
      throw new Error(`Can't sort on ${sortAttribute}`)
    }
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const resp = await db.find({
      selector: {
        dir_id: folderId,
        [sortAttribute]: { $gte: null }
      },
      use_index: index,
      sort: [{ [sortAttribute]: sortOrder }],
      skip,
      limit
    })

    const items = resp.docs
      .filter(f => f._id !== TRASH_DIR_ID) // this query returns the trash folder without an ID...
      .map(f => normalizeFileFromPouchDB(f))

    return sortFilesAndFolders(items, sortAttribute)
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

export const getAdapter = state =>
  shouldWorkFromPouchDB(state)
    ? new PouchDB(state.settings.indexes)
    : new Stack()

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

const sortFilesAndFolders = (items, sortAttribute) => {
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
