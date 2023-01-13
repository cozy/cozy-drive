import maxBy from 'lodash/maxBy'

import { getDocumentFromState } from 'cozy-client/dist/store'

import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'
import { getMirrorQueryId, parseFolderQueryId } from './queries'
import { useParams, useLocation } from 'react-router-dom'
import { useClient } from 'cozy-client'

export const useCurrentFolderId = () => {
  const { folderId } = useParams()
  const { pathname } = useLocation()

  if (folderId) {
    return folderId
  } else if (pathname === '/folder') {
    return ROOT_DIR_ID
  } else if (pathname === '/trash') {
    return TRASH_DIR_ID
  }
  return null
}

export const useCurrentFileId = () => {
  const { fileId } = useParams()

  if (fileId) {
    return fileId
  }
  return null
}

export const useDisplayedFolder = () => {
  const client = useClient()
  const folderId = useCurrentFolderId()

  if (folderId) {
    return client.getDocumentFromState(DOCTYPE_FILES, folderId)
  }
  return null
}

export const useParentFolder = parentFolderId => {
  const client = useClient()

  if (parentFolderId) {
    return client.getDocumentFromState(DOCTYPE_FILES, parentFolderId)
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

export const getFolderContent = (rootState, folderId) => {
  const results = getLatestFolderQueryResults(rootState, folderId)
  if (results.length > 0) {
    const [mostRecentQueryResults, otherQueryResults] = results
    const allContent = mostRecentQueryResults.data.concat(
      otherQueryResults ? otherQueryResults.data : []
    )
    return allContent.map(fileId => {
      return getDocumentFromState(rootState, DOCTYPE_FILES, fileId)
    })
  } else {
    return null
  }
}
