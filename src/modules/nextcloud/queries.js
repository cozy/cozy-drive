import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000 // 9 minutes
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

/**
 *
 * @param {object} params Parameters
 * @param {string} params.sourceAccount The source account of the nextcloud
 * @param {string} params.path The path of the folder where to fetch the files
 * @returns
 */
const buildNextcloudFolderQuery = ({ sourceAccount, path }) => ({
  definition: () =>
    Q('io.cozy.remote.nextcloud.files').where({
      'cozyMetadata.sourceAccount': sourceAccount,
      parentPath: path
    }),
  options: {
    as: `io.cozy.remote.nextcloud.files/sourceAccount/${sourceAccount}/path${path}`,
    fetchPolicy: defaultFetchPolicy,
    enabled: !!sourceAccount && !!path
  }
})

export { buildNextcloudFolderQuery }
