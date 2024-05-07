import CozyClient, { Q } from 'cozy-client'

const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000 // 9 minutes
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

const buildNextcloudFolderQuery = ({ sourceAccount, path }) => ({
  definition: () =>
    Q('io.cozy.remote.nextcloud.files').where({
      sourceAccount,
      path
    }),
  options: {
    as: `io.cozy.remote.nextcloud.files/sourceAccount/${sourceAccount}/path/${path}`,
    fetchPolicy: defaultFetchPolicy,
    enabled: !!sourceAccount
  }
})

export { buildNextcloudFolderQuery }
