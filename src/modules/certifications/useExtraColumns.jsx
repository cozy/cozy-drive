import { useEffect, useMemo } from 'react'

import { useClient } from 'cozy-client'

import { extraColumnsSpecs } from 'modules/certifications/'

/**
 * @typedef {object} ExtraColumn
 * @property {function} query - The query function.
 * @property {function} condition - The condition function.
 * @property {string} label - The label of the column.
 * @property {function} HeaderComponent - The header component.
 * @property {function} CellComponent - The cell component.
 */

// TODO: some ways to improve:
// instead of passing currentFolderId, sharedDocumentIds (related to the query)
// and files (related to the condition), maybe we could pass
// the query/condition with its parameters

/**
 * Custom hook that adds extra columns to a table based on the provided configuration.
 *
 * @param {object} options - The options for configuring the extra columns.
 * @param {string[]} [options.columnsNames] - The names of the columns to add.
 * @param {function} [options.queryBuilder] - The query builder for fetching data.
 * @param {function} [options.conditionBuilder] - The condition builder for filtering data.
 * @param {string} [options.currentFolderId] - The ID of the current folder.
 * @param {string[]} [options.sharedDocumentIds] - The IDs of the shared documents.
 * @param {object[]} [options.files] - The files to display in the table.
 * @returns {object[]} - The extra columns to add to the table.
 */
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
