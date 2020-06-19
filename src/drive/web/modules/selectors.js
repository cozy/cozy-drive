import maxBy from 'lodash/maxBy'
import { getDocumentFromState } from 'cozy-client/dist/store'
import { getMirrorQueryId, parseFolderQueryId } from './queries'

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
    const otherQueryId = getMirrorQueryId(mostRecentQueryResults.id)
    const otherQueryResults = rootState.cozy.queries[otherQueryId]
    const allContent = mostRecentQueryResults.data.concat(
      otherQueryResults ? otherQueryResults.data : []
    )
    return allContent.map(fileId => {
      return getDocumentFromState(rootState, 'io.cozy.files', fileId)
    })
  } else {
    return null
  }
}
