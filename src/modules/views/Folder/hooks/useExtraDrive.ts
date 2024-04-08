import { useQuery } from 'cozy-client'

import { buildExternalDriveQuery } from 'modules/views/Folder/queries/fetchExtraDrive'
import { ExtraDriveFile } from 'modules/views/Folder/types'

/**
 * Custom React hook to fetch data from an external drive folder.
 *
 * This hook encapsulates the logic for building the query parameters and
 * executing the query to fetch files from an external drive. It leverages
 * the 'cozy-client' library's useQuery hook for data fetching.
 *
 * @returns An array of ExtraDriveFile objects representing the files fetched
 * from the external drive. If no data is fetched, an empty array is returned (be careful to handle this case).
 */
export const useExtraDrive = (): ExtraDriveFile[] => {
  // Build the query parameters for fetching external drive data
  const query = buildExternalDriveQuery()

  // Execute the query using cozy-client's useQuery hook
  // The result of the query is cast to ensure it's treated as an array of ExtraDriveFile objects
  const { data } = useQuery(query.definition, query.options) as
    | {
        data: ExtraDriveFile[]
      }
    | { data: null }

  // Return the fetched data
  return data ?? []
}
