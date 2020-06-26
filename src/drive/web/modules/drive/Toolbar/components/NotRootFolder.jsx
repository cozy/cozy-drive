import toolbarContainer from 'drive/web/modules/drive/Toolbar/toolbar'

/**
 * Displays its children only if we are not displaying the root folder
 */
const NotRootFolder = ({ insideRootFolder, children }) => {
  if (insideRootFolder) {
    return null
  }
  return children
}

export default toolbarContainer(NotRootFolder)
