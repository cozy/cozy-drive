import { useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import useCurrentFolderId from '@/hooks/useCurrentFolderId'
import { buildOnlyFolderQuery } from '@/queries'

interface DisplayedFolderResult {
  isNotFound: boolean
  displayedFolder: IOCozyFile | null
}

const useDisplayedFolder = (): DisplayedFolderResult => {
  const folderId = useCurrentFolderId()

  const folderQuery = buildOnlyFolderQuery(folderId)
  const folderResult = useQuery(
    folderQuery.definition,
    folderQuery.options
  ) as unknown as {
    data?: IOCozyFile | null
    fetchStatus: string
    lastError: { status: number }
  }

  if (folderId) {
    const isNotFound =
      folderResult.fetchStatus === 'failed' &&
      folderResult.lastError.status === 404

    return {
      isNotFound,
      displayedFolder: folderResult.data ?? null
    }
  }

  return {
    isNotFound: true,
    displayedFolder: null
  }
}

export default useDisplayedFolder
