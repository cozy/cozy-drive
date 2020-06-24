import CozyClient, { Q } from 'cozy-client'
import { TRASH_DIR_ID } from 'drive/constants/config'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 30 * 60 * 1000
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const parseFolderQueryId = maybeFolderQueryId => {
  const splitted = maybeFolderQueryId.split(' ')
  if (splitted.length !== 4) {
    return null
  }
  return {
    type: splitted[0],
    folderId: splitted[1],
    sortAttribute: splitted[2],
    sortOrder: splitted[3]
  }
}

export const formatFolderQueryId = (
  type,
  folderId,
  sortAttribute,
  sortOrder
) => {
  return `${type} ${folderId} ${sortAttribute} ${sortOrder}`
}

const buildDriveQuery = ({
  currentFolderId,
  type,
  sortAttribute,
  sortOrder
}) => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: currentFolderId,
        _id: { $ne: TRASH_DIR_ID },
        type
      })
      .indexFields(['dir_id', 'type', sortAttribute])
      .sortBy([
        { dir_id: sortOrder },
        { type: sortOrder },
        { [sortAttribute]: sortOrder }
      ]),
  options: {
    as: formatFolderQueryId(type, currentFolderId, sortAttribute, sortOrder),
    fetchPolicy: defaultFetchPolicy
  }
})

/**
 * Get the query for folder if given the query for files
 * and vice versa.
 *
 * If given the queryId `directory id123 name desc`, will return
 * the query `files id123 name desc`.
 */
export const getMirrorQueryId = queryId => {
  const { type, folderId, sortAttribute, sortOrder } = parseFolderQueryId(
    queryId
  )
  const otherType = type === 'directory' ? 'file' : 'directory'
  const otherQueryId = formatFolderQueryId(
    otherType,
    folderId,
    sortAttribute,
    sortOrder
  )
  return otherQueryId
}

export const buildFolderQuery = folderId => ({
  definition: () =>
    Q('io.cozy.files')
      .getById(folderId)
      .include(['parent']),
  options: {
    as: 'folder-' + folderId,
    fetchPolicy: defaultFetchPolicy
  }
})

export { buildQuery }
