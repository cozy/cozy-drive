import { connect } from 'react-redux'
import { ROOT_DIR_ID } from 'drive/constants/config'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder,
  notRootfolder:
    state.view.displayedFolder && state.view.displayedFolder.id !== ROOT_DIR_ID,
  selectionModeActive: isSelectionBarVisible(state)
})

const mapDispatchToProps = dispatch => ({})

const toolbarContainer = component =>
  connect(mapStateToProps, mapDispatchToProps)(component)

export default toolbarContainer
