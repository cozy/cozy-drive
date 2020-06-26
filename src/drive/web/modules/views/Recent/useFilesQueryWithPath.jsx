import { useQuery } from 'cozy-client'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import keyBy from 'lodash/keyBy'
import { buildParentsByIdsQuery } from 'drive/web/modules/queries'

export const useFilesQueryWithPath = query => {
  const result = useQuery(query.definition, query.options)
  const resultData = result.data || []

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
