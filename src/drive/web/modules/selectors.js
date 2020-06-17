import maxBy from 'lodash/maxBy'
import { parseFolderQueryId } from './queries'

export const getCurrentFolderId = rootState => {
  if (rootState.router.params.folderId) {
    return rootState.router.params.folderId
  } else if (rootState.router.location.pathname == '/folder') {
    return 'io.cozy.files.root-dir'
  }
  return null
}

export const getCurrentFileId = rootState => {
  return rootState.router.params.fileId
}

const getFolderContentQueries = (rootState, folderId) => {
  const queries = rootState.cozy.queries
  const folderContentQueries = Object.entries(queries)
    .filter(([queryId]) => {
      const parsed = parseFolderQueryId(queryId)
      if (!parsed) {
        return false
      }
      const { folderId: queryFolderId } = parsed
      if (queryFolderId !== folderId) {
        return false
      }
      return true
    })
    .map(x => x[1])
  return folderContentQueries
}

export const getFolderContent = (rootState, folderId) => {
  const folderContentQueries = getFolderContentQueries(rootState, folderId)
  if (folderContentQueries.length > 0) {
    const mostRecentQueryResults = maxBy(
      folderContentQueries,
      x => x.lastUpdate
    )
    return mostRecentQueryResults.data
  } else {
    return null
  }
}
