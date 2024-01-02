import { useQuery } from 'cozy-client'

import { useCurrentFolderId } from 'hooks'
import { buildOnlyFolderQuery } from 'drive/web/modules/queries'

const useDisplayedFolder = () => {
  const folderId = useCurrentFolderId()

  const folderQuery = buildOnlyFolderQuery(folderId)
  const folderResult = useQuery(folderQuery.definition, {
    ...folderQuery.options,
    enabled: !!folderId
  })

  if (folderId) {
    return {
      displayedFolder: folderResult.data
    }
  }

  return {
    displayedFolder: null
  }
}

export default useDisplayedFolder
