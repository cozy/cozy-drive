import { hasQueryBeenLoaded, useQuery } from 'cozy-client'

import { buildNextcloudShortcutQuery } from 'modules/nextcloud/queries'

const useNextcloudInfos = ({ sourceAccount }) => {
  const nextcloudShortcutsQuery = buildNextcloudShortcutQuery({
    sourceAccount
  })
  const nextcloudShortcutsResult = useQuery(
    nextcloudShortcutsQuery.definition,
    nextcloudShortcutsQuery.options
  )

  if (hasQueryBeenLoaded(nextcloudShortcutsResult)) {
    const instanceName = nextcloudShortcutsResult.data[0].metadata.instanceName
    return {
      isLoading: false,
      instanceName: nextcloudShortcutsResult.data[0].metadata.instanceName,
      instanceUrl: nextcloudShortcutsResult.data[0].metadata.fileIdAttributes,
      rootFolderName: `${instanceName} (Nextcloud)`
    }
  }

  return {
    isLoading: true,
    instanceName: null,
    instanceUrl: null,
    rootFolderName: null
  }
}

export { useNextcloudInfos }
