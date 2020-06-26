import maxBy from 'lodash/maxBy'
import get from 'lodash/get'
import { getDocumentFromState } from 'cozy-client/dist/store'
import { getMirrorQueryId, parseFolderQueryId } from './queries'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

export const getCurrentFolderId = rootState => {
  if (get(rootState, 'router.params.folderId')) {
    return rootState.router.params.folderId
  } else if (get(rootState, 'router.location.pathname') == '/folder') {
    return ROOT_DIR_ID
  } else if (get(rootState, 'router.location.pathname') == '/trash') {
    return TRASH_DIR_ID
  }
  return null
}

export const getCurrentFileId = rootState => {
  return get(rootState, 'router.params.fileId', null)
}

export const getDisplayedFolder = rootState => {
  const folderId = getCurrentFolderId(rootState)
  if (folderId) {
    const doc = getDocumentFromState(rootState, 'io.cozy.files', folderId)
    return doc
  }
  return null
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

export const getLatestFolderQueryResults = (rootState, folderId) => {
  const folderContentQueries = getFolderContentQueries(rootState, folderId)
  if (folderContentQueries.length > 0) {
    const mostRecentQueryResults =
      maxBy(folderContentQueries, x => x.lastUpdate) || folderContentQueries[0]
    const otherQueryId = getMirrorQueryId(mostRecentQueryResults.id)
    const otherQueryResults = rootState.cozy.queries[otherQueryId]
    return [mostRecentQueryResults, otherQueryResults]
  }
  return []
}

const fetchStatusPriorities = {
  pending: 0,
  loading: 1,
  loaded: 2
}
export const getCurrentViewFetchStatus = rootState => {
  const folderId = getCurrentFolderId(rootState)
  const results = getLatestFolderQueryResults(rootState, folderId)
  if (!results || !results.length) {
    return 'loading'
  } else {
    return maxBy(results, r => fetchStatusPriorities[r.fetchStatus]).fetchStatus
  }
}

export const getFolderContent = (rootState, folderId) => {
  const results = getLatestFolderQueryResults(rootState, folderId)
  if (results.length > 0) {
    const [mostRecentQueryResults, otherQueryResults] = results
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
