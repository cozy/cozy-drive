import { useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'

import { ROOT_DIR_ID } from '@/constants/config'
import useCurrentFolderId from '@/hooks/useCurrentFolderId'
import { buildFileOrFolderByIdQuery } from '@/queries'

interface DisplayedFolderResult {
  isNotFound: boolean
  displayedFolder: IOCozyFile | null
  initialDirId: string | null
}

const useDisplayedFolder = (): DisplayedFolderResult => {
  const folderId = useCurrentFolderId() ?? ROOT_DIR_ID

  const folderQuery = buildFileOrFolderByIdQuery(folderId)
  const folderResult = useQuery(
    folderQuery.definition,
    folderQuery.options
  ) as unknown as {
    data?: IOCozyFile | null
    fetchStatus: string
    lastError: { status: number }
  }

  const displayedFolder = folderResult.data ?? null
  const initialDirId = displayedFolder?.id ?? null

  if (folderId) {
    const isNotFound =
      folderResult.fetchStatus === 'failed' &&
      folderResult.lastError.status === 404

    return {
      isNotFound,
      displayedFolder,
      initialDirId
    }
  }

  return {
    isNotFound: true,
    displayedFolder: null,
    initialDirId: null
  }
}

export default useDisplayedFolder
