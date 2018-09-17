import toolbarContainer from 'drive/web/modules/drive/Toolbar/containers/toolbar'
const NotRootFolder = ({ notRootfolder, children }) => {
  if (notRootfolder) {
    return children
  }
  return null
}

export default toolbarContainer(NotRootFolder)
