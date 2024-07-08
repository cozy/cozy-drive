import CozyClient, { Q, hasQueryBeenLoaded } from 'cozy-client'

const FIVE_MINUTES = 5 * 60 * 1000

export const buildSettingsByIdQuery = id => ({
  definition: Q('io.cozy.settings').getById(id),
  options: {
    as: `io.cozy.settings/${id}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(FIVE_MINUTES),
    singleDocData: true
  }
})

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
  sortOrder
) => {
  return `${type} ${folderId} ${sortAttribute} ${sortOrder}`
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
