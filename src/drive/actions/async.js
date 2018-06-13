/* global cozy */
import { isCordova } from '../mobile/lib/device'
import { TRASH_DIR_ID, FILES_FETCH_LIMIT } from '../constants/config.js'

export const shouldShowRecentsFirst = (
  folderPath,
  parentPath,
  specialFolders
) =>
  specialFolders.indexOf(folderPath) !== -1 ||
  specialFolders.indexOf(parentPath) !== -1

class Stack {
  getFolder = async (folderId, specialFolders = []) => {
    const folder = await cozy.client.files.statById(folderId, false, {
      limit: FILES_FETCH_LIMIT
    })

    const parentId = folder.attributes.dir_id
    const parent =
      !!parentId &&
      (await cozy.client.files.statById(parentId, false).catch(ex => {
        if (ex.status === 403) {
          console.warn("User don't have access to parent folder")
        } else {
          throw ex
        }
      }))

    const recentsFirst =
      !!parent &&
      shouldShowRecentsFirst(
        folder.attributes.path,
        parent.attributes.path,
        specialFolders
      )

    const files = recentsFirst
      ? await this.getSortedFolder(folderId, 'updated_at', 'desc')
      : folder
          .relations('contents')
          .filter(f => f !== undefined)
          .map(f => extractFileAttributes(f)) || []

    return {
      ...extractFileAttributes(folder),
      contents: {
        data: files,
        meta: {
          count: folder.relationships.contents.meta.count
        }
      },
      parent: !!parent && extractFileAttributes(parent)
    }
  }

  getFolderContents = async (folderId, skip = 0, limit = FILES_FETCH_LIMIT) => {
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
    limit = FILES_FETCH_LIMIT,
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
    limit: FILES_FETCH_LIMIT
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
  constructor({ folders, recent, sort }) {
    this.folderIndex = folders
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

  getFolderContents = async (folderId, skip = 0, limit = FILES_FETCH_LIMIT) => {
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
    limit = FILES_FETCH_LIMIT,
    loadedFoldersCount = 0,
    loadedFilesCount = 0
  ) => {
    const shouldSeparateFilesAndFolders = sortAttribute === 'name'
    const index = this.sortIndexes[sortAttribute]
    if (!index) {
      throw new Error(`Can't sort on ${sortAttribute}`)
    }
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const query = (selector = {}, skipRows = skip) =>
      db
        .find({
          selector: {
            ...selector,
            ...{
              dir_id: folderId,
              _id: { $ne: TRASH_DIR_ID },
              [sortAttribute]: { $gte: null }
            }
          },
          use_index: index,
          sort: [{ [sortAttribute]: sortOrder }],
          skip: skipRows,
          limit
        })
        .then(resp => resp.docs.map(f => normalizeFileFromPouchDB(f)))

    if (shouldSeparateFilesAndFolders) {
      const folders = await query({
        type: 'directory'
      })
      const files =
        folders.length < limit
          ? await query(
              {
                type: { $ne: 'directory' }
              },
              loadedFilesCount
            )
          : []
      return [...folders, ...files]
    } else {
      return query()
    }
  }

  getRecentFiles = async () => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const files = await db.query(this.recentIndex, {
      limit: FILES_FETCH_LIMIT,
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
