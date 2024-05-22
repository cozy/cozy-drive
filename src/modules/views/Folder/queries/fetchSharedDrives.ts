import CozyClient, { Q, QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

import { SHARED_DRIVES_DIR_ID, TRASH_DIR_ID } from 'constants/config'

/**
 * Builds a query to fetch shared drives
 * This only fetches shortcuts for now as it used to access external drives like Nextcloud
 *
 * Usage:
 * const { definition, options } = buildsharedDrivesQuery({
 *  sortAttribute: 'name',
 *  sortOrder: 'asc'
 * });
 */
export const buildSharedDrivesQuery = ({
  sortAttribute,
  sortOrder
}: {
  sortAttribute: string
  sortOrder: string
}): {
  definition: () => QueryDefinition
  options: QueryOptions
} => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: SHARED_DRIVES_DIR_ID,
        class: 'shortcut',
        [sortAttribute]: { $gt: null }
      })
      .partialIndex({
        // This is to avoid fetching trash
        // They are hidden clientside
        _id: {
          $nin: [TRASH_DIR_ID]
        }
      })
      .indexFields(['dir_id', 'class', sortAttribute])
      .sortBy([
        { dir_id: sortOrder },
        { class: sortOrder },
        { [sortAttribute]: sortOrder }
      ])
      .limitBy(100),
  options: {
    as: `${SHARED_DRIVES_DIR_ID}/sortAttribute/${sortAttribute}/sortOrder/${sortOrder}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(1000 * 60 * 10) // 10 minutes
  }
})
