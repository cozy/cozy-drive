import { useParams } from 'react-router-dom'

import { NextcloudFile, UseQueryReturnValue } from 'cozy-client/types/types'

import { computeNextcloudRootFolder } from '@/components/FolderPicker/helpers'
import { getParentPath } from '@/lib/path'
import { hasDataLoaded } from '@/lib/queries'
import { useNextcloudFolder } from '@/modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudInfos } from '@/modules/nextcloud/hooks/useNextcloudInfos'
import { useNextcloudPath } from '@/modules/nextcloud/hooks/useNextcloudPath'

/**
 * Nextcloud don't have route to get parent folder
 * so we need to fetch the content of his parent folder to get current folder data
 */
const useNextcloudCurrentFolder = (): NextcloudFile | undefined => {
  const { sourceAccount } = useParams()
  const path = useNextcloudPath()

  const { instanceName } = useNextcloudInfos({ sourceAccount })
  const { nextcloudResult } = useNextcloudFolder({
    sourceAccount,
    path: getParentPath(path)
  }) as {
    nextcloudResult: {
      data?: NextcloudFile[] | null
    }
  }

  if (path === '/' && sourceAccount) {
    return computeNextcloudRootFolder({
      sourceAccount,
      instanceName
    })
  }

  if (hasDataLoaded(nextcloudResult as UseQueryReturnValue)) {
    return (nextcloudResult.data ?? []).find(file => file.path === path)
  }

  return undefined
}

export { useNextcloudCurrentFolder }
