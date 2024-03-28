import CozyClient, { QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

import logger from 'lib/logger'
import { buildDriveQuery } from 'modules/queries'
import {
  FetchedExtraDriveData,
  SortOrder,
  StackClient
} from 'modules/views/Folder/types'

/**
 * Asynchronously fetches data from external drives.
 * @param client - An instance of CozyClient to interact with Cozy's stack.
 * @returns A Promise resolving to the fetched data as FetchedExtraDriveData.
 *
 * Usage:
 * const data = await fetchExternalDriveData(cozyClient);
 */
export const fetchExternalDriveData = async (
  client: CozyClient
): Promise<FetchedExtraDriveData> => {
  try {
    // Utilizes CozyClient's stack client to fetch JSON data from the specified endpoint
    return await (client.getStackClient() as StackClient).fetchJSON(
      'POST',
      `/files/shared-drives`
    )
  } catch (error) {
    // Logs error and rethrows for upstream handling
    logger.error('Error in fetchExternalDriveData:', error)
    throw error
  }
}

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
