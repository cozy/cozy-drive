import { hasQueryBeenLoaded, useQuery } from 'cozy-client'

import { buildNextcloudShortcutQuery } from '@/queries'

/**
 * @typedef {Object} NextcloudInfos
 * @property {boolean} isLoading -  Whether the data is still loading
 * @property {string} [instanceName] - The name of the Nextcloud instance
 * @property {string} [instanceUrl] - The URL of the Nextcloud instance
 * @property {string} [rootFolderName] - The name of the root folder
 */

/**
 * Fetches the Nextcloud instance name and URL
 *
 * @param {Object} params
 * @param {string} [params.sourceAccount] - The source account
 * @returns {NextcloudInfos}
 */
const useNextcloudInfos = ({ sourceAccount }) => {
  const nextcloudShortcutsQuery = buildNextcloudShortcutQuery({
    sourceAccount
  })
  const nextcloudShortcutsResult = useQuery(
    nextcloudShortcutsQuery.definition,
    nextcloudShortcutsQuery.options
  )

  if (
    hasQueryBeenLoaded(nextcloudShortcutsResult) &&
    nextcloudShortcutsResult.data.length > 0
  ) {
    const instanceName = nextcloudShortcutsResult.data[0].metadata.instanceName
    return {
      isLoading: false,
      instanceName: nextcloudShortcutsResult.data[0].metadata.instanceName,
      instanceUrl: nextcloudShortcutsResult.data[0].metadata.fileIdAttributes,
      rootFolderName: `${instanceName} (Nextcloud)`
    }
  }

  return {
    isLoading: true
  }
}

export { useNextcloudInfos }
