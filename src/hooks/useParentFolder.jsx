import { useClient } from 'cozy-client'
import { DOCTYPE_FILES } from 'lib/doctypes'

const useParentFolder = parentFolderId => {
  const client = useClient()

  if (parentFolderId) {
    return client.getDocumentFromState(DOCTYPE_FILES, parentFolderId)
  }
  return null
}

export default useParentFolder
