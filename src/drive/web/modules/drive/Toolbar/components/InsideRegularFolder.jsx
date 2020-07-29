import toolbarContainer from 'drive/web/modules/drive/Toolbar/toolbar'

/**
 * Displays its children only if we are in a normal folder (eg. not the root folder or a special view like sharings or recent)
 */
const InsideRegularFolder = ({ insideRegularFolder, children }) => {
  if (insideRegularFolder) {
    return children
  }
  return null
}

export default toolbarContainer(InsideRegularFolder)
