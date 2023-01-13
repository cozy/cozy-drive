import { useClient } from 'cozy-client'
import { useCurrentFolderId } from 'drive/hooks'
import { DOCTYPE_FILES } from 'drive/lib/doctypes'

const useDisplayedFolder = () => {
  const client = useClient()
  const folderId = useCurrentFolderId()

  if (folderId) {
    return client.getDocumentFromState(DOCTYPE_FILES, folderId)
  }
  return null
}

export default useDisplayedFolder
