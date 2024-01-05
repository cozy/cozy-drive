import get from 'lodash/get'
import uniq from 'lodash/uniq'
import keyBy from 'lodash/keyBy'

import { useQuery } from 'cozy-client'

import { buildParentsByIdsQuery, buildFileByIdQuery } from 'modules/queries'
import { TRASH_DIR_ID } from 'constants/config'

export const isFileNotTrashed = file =>
  file.dir_id !== TRASH_DIR_ID && file.trashed !== true

export const useFilesQueryWithPath = query => {
  const result = useQuery(query.definition, query.options)
  const resultData = (result.data || []).filter(isFileNotTrashed)

  const dirIds = uniq(resultData.map(({ dir_id }) => dir_id))
  const parentsQuery = buildParentsByIdsQuery(dirIds)
  const parentsResult = useQuery(parentsQuery.definition, parentsQuery.options)
  const parentsResultData = parentsResult.data || []

  let parentsDocsById = {}
  const isLoading =
    parentsResult.fetchStatus === 'loading' && !parentsResult.lastUpdate

  if (!isLoading && parentsResultData.length > 0) {
    parentsDocsById = keyBy(parentsResult.data, '_id')
  }

  return {
    ...result,
    data: resultData.map(file => ({
      ...file,
      displayedPath: get(parentsDocsById[file.dir_id], 'path')
    }))
  }
}

// TODO: since https://github.com/cozy/cozy-client/pull/947 is merged
// remove the tricks on useQueries and use 'enabled' param instead.
// Be aware for now a query with 'enabled' true remains in 'pending' status
// so fetchStatus test should be used carefully especially with 'loaded' values
export const useFileWithPath = docId => {
  // trick here to get loaded fetchStatus with an undefined docId
  const fileQuery = docId
    ? buildFileByIdQuery(docId)
    : buildParentsByIdsQuery([])
  const fileResult = useQuery(fileQuery.definition, fileQuery.options)
  const resultData = fileResult.data

  // trick here to return an empty array and use it in buildParentsByIdsQuery if no dirId
  const dirId = resultData && resultData.dir_id ? resultData.dir_id : []

  // same trick as for fileQuery
  const parentQuery = Array.isArray(dirId)
    ? buildParentsByIdsQuery(dirId)
    : buildFileByIdQuery(dirId)
  const parentResult = useQuery(parentQuery.definition, parentQuery.options)
  const parentData = parentResult.data

  return {
    ...fileResult,
    fetchStatus:
      fileResult.fetchStatus === 'loaded' &&
      parentResult &&
      parentResult.fetchStatus === 'loaded'
        ? 'loaded'
        : 'loading',
    data: {
      ...resultData,
      displayedPath: parentData ? parentData.path : undefined
    }
  }
}
