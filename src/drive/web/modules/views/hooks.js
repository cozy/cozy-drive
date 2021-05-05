import get from 'lodash/get'
import uniq from 'lodash/uniq'
import keyBy from 'lodash/keyBy'

import { isQueryLoading, useQuery } from 'cozy-client'

import {
  buildParentsByIdsQuery,
  buildFileByIdQuery
} from 'drive/web/modules/queries'
import { TRASH_DIR_ID } from 'drive/constants/config'

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

export const useFileWithPath = fileId => {
  const fileQuery = buildFileByIdQuery(fileId)
  const fileResult = useQuery(fileQuery.definition, fileQuery.options)
  const resultData = fileResult.data
  const dirId = resultData ? resultData.dir_id : {}

  const parentQuery = buildFileByIdQuery(dirId)
  const parentResult = useQuery(parentQuery.definition, parentQuery.options)
  const parentData = parentResult.data

  if (isQueryLoading(fileResult) || isQueryLoading(parentResult)) {
    return { data: null }
  }

  return {
    data: {
      ...resultData,
      displayedPath: parentData ? parentData.path : undefined
    }
  }
}
