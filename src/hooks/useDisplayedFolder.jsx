import { useQuery } from 'cozy-client'

import { useCurrentFolderId } from 'hooks'
import { buildOnlyFolderQuery } from 'modules/queries'

const useDisplayedFolder = () => {
  const folderId = useCurrentFolderId()

  const folderQuery = buildOnlyFolderQuery(folderId)
  const folderResult = useQuery(folderQuery.definition, {
    ...folderQuery.options,
    enabled: !!folderId
  })

  if (folderId) {
    const isNotFound =
      folderResult.fetchStatus === 'failed' &&
      folderResult.lastError.status === 404

    return {
      isNotFound,
      displayedFolder: folderResult.data
    }
  }

  return {
    isNotFound: true,
    displayedFolder: null
  }
}

export default useDisplayedFolder
