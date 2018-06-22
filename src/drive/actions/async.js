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

  query = async ({ folderId, type, sortAttribute, sortOrder, skip, limit }) => {
    const index = await cozy.client.data.defineIndex('io.cozy.files', [
      'dir_id',
      'type',
      sortAttribute
    ])
    const response = await cozy.client.files.query(index, {
      selector: {
        dir_id: folderId,
        type,
        name: { $gt: null }
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
        skip,
        limit
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

  getRecentFiles = async () => {
    const index = await cozy.client.data.defineIndex('io.cozy.files', [
      'updated_at',
      'trashed'
    ])
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
      folders: byName,
      filesByName: byName,
      filesByUpdate: byUpdatedAt,
      filesBySize: bySize,
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
      : await this.getFolderContents(folderId)

    return {
      ...this.normalizeFileFromPouchDB(folder),
      contents: {
        data: files,
        meta: {}
      },
      parent: !!parent && this.normalizeFileFromPouchDB(parent)
    }
  }

  getFolderContents = async (folderId, skip = 0, limit = FILES_FETCH_LIMIT) => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')
    const isFirstLoad = skip === 0
    let folders = { docs: [] }

    if (isFirstLoad) {
      folders = await db.find({
        selector: {
          dir_id: folderId,
          type: 'directory',
          name: { $gt: null }
        },
        use_index: this.indexes.folders,
        sort: ['dir_id', 'type', 'name'],
        skip: 0,
        limit: null
      })
    }

    const files = await db.find({
      selector: {
        dir_id: folderId,
        type: 'file',
        name: { $gt: null }
      },
      use_index: this.indexes.filesByName,
      sort: ['dir_id', 'type', 'name'],
      skip,
      limit
    })

    return folders.docs
      .filter(folder => folder._id !== TRASH_DIR_ID)
      .concat(files.docs)
      .map(this.normalizeFileFromPouchDB)
  }

  query = async ({
    index,
    folderId,
    type,
    sortAttribute,
    sortOrder,
    skip,
    limit
  }) => {
    const db = cozy.client.offline.getDatabase('io.cozy.files')

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

  getIndex(attribute) {
    switch (attribute) {
      case 'name':
        return this.indexes.filesByName
      case 'updated_at':
        return this.indexes.filesByUpdate
      case 'size':
        return this.indexes.filesBySize
      default:
        console.warn(
          `No suitable index for attribute ${attribute}. This might be slow.`
        )
        return null
    }
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
        index: this.indexes.folders,
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
      index: this.getIndex(sortAttribute),
      folderId,
      type: 'file',
      sortAttribute,
      sortOrder,
      skip,
      limit
    })
    return [...folders, ...files]
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

export const getAdapter = state =>
  shouldWorkFromPouchDB(state)
    ? new PouchDB(state.settings.indexes)
    : new Stack()

const shouldWorkFromPouchDB = state => {
  const settings = state.settings
  return (
    //    isCordova() &&
    settings.offline && settings.firstReplication && settings.indexes
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
