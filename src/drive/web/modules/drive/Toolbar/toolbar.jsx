import { connect } from 'react-redux'
import { ROOT_DIR_ID } from 'drive/constants/config'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { getDisplayedFolder } from 'drive/web/modules/selectors'

const mapStateToProps = state => {
  const displayedFolder = getDisplayedFolder(state)

  const insideRootFolder = displayedFolder && displayedFolder.id === ROOT_DIR_ID

  return {
    displayedFolder,
    insideRootFolder: insideRootFolder,
    selectionModeActive: isSelectionBarVisible(state)
  }
}

const toolbarContainer = connect(mapStateToProps)

export default toolbarContainer
