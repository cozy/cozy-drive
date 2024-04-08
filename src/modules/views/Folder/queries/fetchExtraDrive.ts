import { QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

import { buildDriveQuery } from 'modules/queries'
import { SortOrder } from 'modules/views/Folder/types'

/**
 * Builds a query for fetching files from an external drive with specified sorting.
 * @param sortOrder - Specifies how the results should be sorted.
 * @param externalDriveId - The unique identifier for the external drive.
 * @returns An object containing the definition of the query and the options for executing it.
 *
 * Usage:
 * const { definition, options } = buildExternalDriveFilesQuery({ attribute: 'name', order: 'asc' }, 'driveId');
 */
export const buildExternalDriveFilesQuery = (
  sortOrder: SortOrder,
  externalDriveId: string
): { definition: QueryDefinition; options: QueryOptions } => {
  // Builds a drive query with provided parameters
  const buildedFilesQuery = buildDriveQuery({
    currentFolderId: externalDriveId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })

  // Returns the query definition and options for execution
  return {
    definition: buildedFilesQuery.definition(),
    options: buildedFilesQuery.options
  }
}

/**
 * Convenience function to build a query for fetching external drive data.
 * Preconfigured to sort by name in ascending order and target the shared drives directory.
 * @returns An object with the definition of the query and the options for its execution.
 *
 * Usage:
 * const { definition, options } = buildExternalDriveQuery();
 */
export const buildExternalDriveQuery = (): {
  definition: QueryDefinition
  options: QueryOptions
} =>
  // Utilizes buildExternalDriveFilesQuery with preconfigured parameters
  buildExternalDriveFilesQuery(
    {
      attribute: 'name',
      order: 'asc'
    },
    'io.cozy.files.shared-drives-dir'
  )
