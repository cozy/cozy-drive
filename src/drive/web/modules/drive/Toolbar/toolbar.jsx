import { connect } from 'react-redux'
import { ROOT_DIR_ID } from 'drive/constants/config'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { uploadFiles } from 'drive/web/modules/navigation/duck'

const mapStateToProps = state => ({
  displayedFolder: state.view.displayedFolder,
  notRootfolder:
    state.view.displayedFolder && state.view.displayedFolder.id !== ROOT_DIR_ID,
  selectionModeActive: isSelectionBarVisible(state)
})

const mapDispatchToProps = dispatch => ({
  uploadFiles: (files, displayedFolder, sharingState) => {
    dispatch(uploadFiles(files, displayedFolder.id, sharingState))
  }
})

const toolbarContainer = component =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(component)

export default toolbarContainer
