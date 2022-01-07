import { useEffect, useMemo } from 'react'

import { useClient } from 'cozy-client'

import { extraColumnsSpecs } from 'drive/web/modules/certifications/'

// TODO: some ways to improve:
// instead of passing currentFolderId, sharedDocumentIds (related to the query)
// and files (related to the condition), maybe we could pass
// the query/condition with its parameters directly
export const useExtraColumns = ({
  columnsNames,
  queryBuilder,
  conditionBuilder,
  currentFolderId,
  sharedDocumentIds,
  files
}) => {
  const client = useClient()
  const columnsSpecs = useMemo(
    () => columnsNames.map(columnName => extraColumnsSpecs[columnName]),
    [columnsNames]
  )

  useEffect(() => {
    if (!queryBuilder) {
      return
    }
    for (let columnSpec of columnsSpecs) {
      if (!columnSpec.query) {
        continue
      }
      const opts = {
        queryBuilder,
        currentFolderId,
        sharedDocumentIds,
        attribute: columnSpec.label
      }
      const def = columnSpec.query(opts).definition()
      client.query(def, columnSpec.query(opts).options)
    }
  }, [client, columnsSpecs, currentFolderId, sharedDocumentIds, queryBuilder])

  return columnsSpecs.filter(columnSpec => {
    if (conditionBuilder) {
      const opts = {
        conditionBuilder,
        files,
        attribute: columnSpec.label
      }
      return columnSpec.condition(opts)
    } else if (queryBuilder) {
      const opts = {
        queryBuilder,
        currentFolderId,
        sharedDocumentIds,
        attribute: columnSpec.label
      }
      const { fetchStatus, data } = client.getQueryFromState(
        columnSpec.query(opts).options.as
      )
      return fetchStatus === 'loaded' && data.length > 0
    } else {
      throw new Error(
        'useExtraColumns must have queryBuilder or conditionBuilder'
      )
    }
  })
}
