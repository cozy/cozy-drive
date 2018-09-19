import toolbarContainer from 'drive/web/modules/drive/Toolbar/toolbar'
const NotRootFolder = ({ notRootfolder, children }) => {
  if (notRootfolder) {
    return children
  }
  return null
}

export default toolbarContainer(NotRootFolder)
