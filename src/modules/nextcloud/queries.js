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
export const buildNextcloudFolderQuery = ({ sourceAccount, path }) => ({
  definition: () =>
    Q('io.cozy.remote.nextcloud.files').where({
      'cozyMetadata.sourceAccount': sourceAccount,
      parentPath: path
    }),
  options: {
    as: computeNextcloudFolderQueryId({ sourceAccount, path }),
    fetchPolicy: defaultFetchPolicy,
    enabled: !!sourceAccount && !!path
  }
})

export const computeNextcloudFolderQueryId = ({ sourceAccount, path }) => {
  return `io.cozy.remote.nextcloud.files/sourceAccount/${sourceAccount}/path${path}`
}

export const buildNextcloudShortcutQuery = ({ sourceAccount }) => ({
  definition: () =>
    Q('io.cozy.files')
      .partialIndex({
        'cozyMetadata.createdByApp': 'nextcloud',
        'cozyMetadata.sourceAccount': sourceAccount
      })
      .indexFields(['cozyMetadata.createdByApp', 'cozyMetadata.sourceAccount'])
      .limitBy(1),
  options: {
    as: `io.cozy.files/createdByApp/nextcloud/sourceAccount/${sourceAccount}`,
    fetchPolicy: defaultFetchPolicy,
    enabled: !!sourceAccount,
    singleDocData: true
  }
})
