import { connect } from 'react-redux'
import flag from 'cozy-flags'
import { ROOT_DIR_ID } from 'drive/constants/config'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import { getDisplayedFolder } from 'drive/web/modules/selectors'

const mapStateToProps = state => {
  const displayedFolder = flag('drive.client-migration.enabled')
    ? getDisplayedFolder(state)
    : state.view.displayedFolder

  return {
    displayedFolder,
    notRootfolder: !displayedFolder || displayedFolder.id !== ROOT_DIR_ID,
    selectionModeActive: isSelectionBarVisible(state)
  }
}

const toolbarContainer = connect(mapStateToProps)

export default toolbarContainer
