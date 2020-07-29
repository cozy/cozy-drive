import { connect } from 'react-redux'
import { ROOT_DIR_ID } from 'drive/constants/config'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import {
  getDisplayedFolder,
  getCurrentFolderId
} from 'drive/web/modules/selectors'

const mapStateToProps = state => {
  const displayedFolder = getDisplayedFolder(state)
  const folderId = getCurrentFolderId(state)

  const insideRegularFolder =
    folderId && displayedFolder && displayedFolder.id !== ROOT_DIR_ID

  return {
    displayedFolder,
    insideRegularFolder: insideRegularFolder,
    selectionModeActive: isSelectionBarVisible(state)
  }
}

const toolbarContainer = connect(mapStateToProps)

export default toolbarContainer
