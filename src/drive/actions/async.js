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
  constructor() {
    this.indexes = {}
  }

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
    limit = FILES_FETCH_LIMIT
  ) => {
    const isFirstLoad = skip === 0
    let folders = []

    if (isFirstLoad) {
      const folderSortingOrder = sortAttribute === 'name' ? sortOrder : 'asc'
      const allFolders = await this.query({
        folderId,
        type: 'directory',
        sortAttribute,
        sortOrder: folderSortingOrder,
        skip: 0,
        limit: null
      })
      folders = allFolders.filter(folder => folder._id !== TRASH_DIR_ID)
    }

    const files = await this.query({
      folderId,
      type: 'file',
      sortAttribute,
      sortOrder,
      skip,
      limit
    })

    return [...folders, ...files]
  }

  query = async ({ folderId, type, sortAttribute, sortOrder, skip, limit }) => {
    const index = await this.getIndex(sortAttribute, [
      'dir_id',
      'type',
      sortAttribute
    ])

    const response = await cozy.client.files.query(index, {
      selector: {
        dir_id: folderId,
        type,
        [sortAttribute]: { $gt: null }
      },
      sort: [
        { dir_id: sortOrder },
        { type: sortOrder },
        { [sortAttribute]: sortOrder }
      ],
      skip,
      limit,
      wholeResponse: true
    })

    return response.data.map(f => extractFileAttributes(f))
  }

  getIndex = async (name, fields) => {
    if (this.indexes[name]) return this.indexes[name]
    else {
      const index = await cozy.client.data.defineIndex('io.cozy.files', fields)
      this.indexes[name] = index
      return index
    }
  }

  getRecentFiles = async () => {
    const index = await this.getIndex('recent', ['updated_at', 'trashed'])

    const resp = await cozy.client.files.query(index, {
      selector: {
        updated_at: { $gt: null },
        trashed: false
      },
      sort: [{ updated_at: 'desc' }, { trashed: 'desc' }],
      limit: FILES_FETCH_LIMIT,
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
  constructor({ byName, byUpdatedAt, bySize, recentFiles }) {
    this.indexes = {
      name: byName,
      updated_at: byUpdatedAt,
      size: bySize,
      recentFiles: recentFiles
    }
  }

  normalizeFileFromPouchDB = f => ({
    ...f,
    id: f._id,
    _type: 'io.cozy.files'
  })

  getFolder = async (folderId, specialFolders = []) => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const folder = await db.get(folderId)
    const parent = !!folder.dir_id && (await db.get(folder.dir_id))
    const recentsFirst =
      !!parent &&
      shouldShowRecentsFirst(folder.path, parent.path, specialFolders)

    const files = recentsFirst
      ? await this.getSortedFolder(folderId, 'updated_at', 'desc')
      : await this.getSortedFolder(folderId, 'name', 'asc')

    return {
      ...this.normalizeFileFromPouchDB(folder),
      contents: {
        data: files,
        meta: {}
      },
      parent: !!parent && this.normalizeFileFromPouchDB(parent)
    }
  }

  getFolderContents = (folderId, skip = 0, limit = FILES_FETCH_LIMIT) =>
    this.getSortedFolder(folderId, 'name', 'asc', skip, limit)

  getSortedFolder = async (
    folderId,
    sortAttribute,
    sortOrder = 'asc',
    skip = 0,
    limit = FILES_FETCH_LIMIT
  ) => {
    const isFirstLoad = skip === 0
    let folders = []

    if (isFirstLoad) {
      const folderSortingOrder = sortAttribute === 'name' ? sortOrder : 'asc'

      const allFolders = await this.query({
        folderId,
        type: 'directory',
        sortAttribute: 'name',
        sortOrder: folderSortingOrder,
        skip: 0,
        limit: null
      })
      folders = allFolders.filter(folder => folder._id !== TRASH_DIR_ID)
    }

    const files = await this.query({
      folderId,
      type: 'file',
      sortAttribute,
      sortOrder,
      skip,
      limit
    })
    return [...folders, ...files]
  }

  query = async ({ folderId, type, sortAttribute, sortOrder, skip, limit }) => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const index = this.indexes[sortAttribute]

    if (!index)
      console.warn(
        `No suitable index found for atribute ${sortAttribute}. This might be slow.`
      )

    const response = await db.find({
      selector: {
        dir_id: folderId,
        type: type,
        [sortAttribute]: { $gt: null }
      },
      use_index: index,
      sort: [
        { dir_id: sortOrder },
        { type: sortOrder },
        { [sortAttribute]: sortOrder }
      ],
      skip,
      limit
    })

    return response.docs.map(this.normalizeFileFromPouchDB)
  }

  getRecentFiles = async () => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const files = await db.query(this.indexes.recentFiles, {
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

const StackAdapter = new Stack()
export const getAdapter = state =>
  shouldWorkFromPouchDB(state)
    ? new PouchDB(state.settings.indexes)
    : StackAdapter

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
