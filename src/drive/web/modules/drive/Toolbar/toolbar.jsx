import { connect } from 'react-redux'
import flag from 'cozy-flags'
import { ROOT_DIR_ID } from 'drive/constants/config'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { getDisplayedFolder } from 'drive/web/modules/selectors'

const mapStateToProps = state => {
  const displayedFolder = flag('drive.client-migration.enabled')
    ? getDisplayedFolder(state)
    : state.view.displayedFolder

  const notRootFolder = displayedFolder && displayedFolder.id !== ROOT_DIR_ID
  const insideRootFolder = displayedFolder && displayedFolder.id === ROOT_DIR_ID

  return {
    displayedFolder,
    insideRootFolder: flag('drive.client-migration.enabled')
      ? insideRootFolder
      : !notRootFolder,
    selectionModeActive: isSelectionBarVisible(state)
  }
}

const toolbarContainer = connect(mapStateToProps)

export default toolbarContainer
