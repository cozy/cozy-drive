import { ROOT_DIR_ID } from 'drive/constants/config'
import { isEncryptedFolder } from 'drive/lib/encryption'
import { useCurrentFolderId, useDisplayedFolder } from 'drive/hooks'

/**
 * Displays its children only if we are in a normal folder (eg. not the root folder or a special view like sharings or recent)
 */
const InsideRegularFolder = ({ children }) => {
  const folderId = useCurrentFolderId()
  const displayedFolder = useDisplayedFolder()

  const insideRegularFolder =
    folderId &&
    displayedFolder &&
    displayedFolder.id !== ROOT_DIR_ID &&
    !isEncryptedFolder(displayedFolder)

  if (insideRegularFolder) {
    return children
  }
  return null
}

export default InsideRegularFolder
