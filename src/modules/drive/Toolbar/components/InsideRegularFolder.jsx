import { ROOT_DIR_ID } from '@/constants/config'
import { isEncryptedFolder } from '@/lib/encryption'

/**
 * Displays its children only if we are in a normal folder (eg. not the root folder or a special view like sharings or recent)
 */
const InsideRegularFolder = ({ children, displayedFolder, folderId }) => {
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
