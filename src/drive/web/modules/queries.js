import CozyClient, { Q } from 'cozy-client'
import { TRASH_DIR_ID } from 'drive/constants/config'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 30 * 60 * 1000

const buildQuery = ({ currentFolderId, type, sortAttribute, sortOrder }) => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: currentFolderId,
        _id: { $ne: TRASH_DIR_ID },
        type
      })
      .indexFields(['dir_id', 'type', sortAttribute])
      .sortBy([
        { dir_id: sortOrder },
        { type: sortOrder },
        { [sortAttribute]: sortOrder }
      ]),
  options: {
    as: `${type}-${currentFolderId}-${sortAttribute}-${sortOrder}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(
      DEFAULT_CACHE_TIMEOUT_QUERIES
    )
  }
})

export { buildQuery }
