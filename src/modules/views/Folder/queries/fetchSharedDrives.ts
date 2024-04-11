import { QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

import { SHARED_DRIVES_DIR_PATH } from 'constants/config'
import { buildDriveQuery } from 'modules/queries'
import { SortOrder } from 'modules/views/Folder/types'

/**
 * Builds a query for fetching files from a shared drive with specified sorting.
 * @param sortOrder - Specifies how the results should be sorted.
 * @param sharedDrivesId - The unique identifier for the shared drive.
 * @returns An object containing the definition of the query and the options for executing it.
 *
 * Usage:
 * const { definition, options } = buildSharedDrivesFilesQuery({ attribute: 'name', order: 'asc' }, 'driveId');
 */
export const buildSharedDrivesFilesQuery = (
  sortOrder: SortOrder,
  sharedDrivesId: string
): { definition: QueryDefinition; options: QueryOptions } => {
  // Builds a drive query with provided parameters
  const buildedFilesQuery = buildDriveQuery({
    currentFolderId: sharedDrivesId,
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
 * Convenience function to build a query for fetching shared drive data.
 * Preconfigured to sort by name in ascending order and target the shared drives directory.
 * @returns An object with the definition of the query and the options for its execution.
 *
 * Usage:
 * const { definition, options } = buildsharedDrivesQuery();
 */
export const buildSharedDrivesQuery = (): {
  definition: QueryDefinition
  options: QueryOptions
} =>
  // Utilizes buildsharedDrivesFilesQuery with preconfigured parameters
  buildSharedDrivesFilesQuery(
    {
      attribute: 'name',
      order: 'asc'
    },
    SHARED_DRIVES_DIR_PATH as string
  )
