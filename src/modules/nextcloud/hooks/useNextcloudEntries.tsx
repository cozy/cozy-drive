import { useLocation, useParams } from 'react-router-dom'

import { NextcloudFile } from 'cozy-client/types/types'

import { hasDataLoaded } from '@/lib/queries'
import { useNextcloudFolder } from '@/modules/nextcloud/hooks/useNextcloudFolder'
import { useNextcloudPath } from '@/modules/nextcloud/hooks/useNextcloudPath'

interface useNextcloudEntriesReturn {
  isLoading: boolean
  entries?: NextcloudFile[]
  hasEntries: boolean
}

const useNextcloudEntries = ({
  insideTrash = false
} = {}): useNextcloudEntriesReturn => {
  const { state } = useLocation() as {
    state?: { fileIds?: string[] }
  }

  const { sourceAccount } = useParams()
  const path = useNextcloudPath({
    insideTrash
  })

  const { nextcloudResult } = useNextcloudFolder({
    sourceAccount,
    path,
    insideTrash
  })

  if (!state?.fileIds) {
    return {
      isLoading: false,
      hasEntries: false
    }
  }

  if (hasDataLoaded(nextcloudResult)) {
    const entries = nextcloudResult.data.filter(({ _id }) =>
      state.fileIds.includes(_id)
    )
    return {
      isLoading: false,
      hasEntries: entries.length > 0,
      entries
    }
  }

  return {
    isLoading: true,
    hasEntries: true
  }
}

export { useNextcloudEntries }
