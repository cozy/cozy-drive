import { hasQueryBeenLoaded } from 'cozy-client'

/**
 * Check if the query has been loaded and if it has data
 *
 * @param {import('cozy-client/types/types').UseQueryReturnValue} queryResult
 * @returns {boolean}
 */
export const hasDataLoaded = queryResult => {
  return hasQueryBeenLoaded(queryResult) && queryResult.data
}

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
  sortOrder,
  driveId = ''
) => {
  return `${type} ${folderId} ${sortAttribute} ${sortOrder} ${driveId}`.trim()
}

/**
 * Get the query for folder if given the query for files
 * and vice versa.
 *
 * If given the queryId `directory id123 name desc`, will return
 * the query `files id123 name desc`.
 */
export const getMirrorQueryId = queryId => {
  const { type, folderId, sortAttribute, sortOrder } =
    parseFolderQueryId(queryId)
  const otherType = type === 'directory' ? 'file' : 'directory'
  const otherQueryId = formatFolderQueryId(
    otherType,
    folderId,
    sortAttribute,
    sortOrder
  )
  return otherQueryId
}
