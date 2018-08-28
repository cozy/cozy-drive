import React, { Component } from 'react'
import { connect } from 'react-redux'

import FileListHeader, {
  MobileFileListHeader
} from 'drive/web/modules/filelist/FileListHeader'
import FileListBody from 'drive/web/modules/filelist/FileListBody'
import FileActionMenu from 'drive/web/modules/actionmenu/FileActionMenu'

import {
  showActionMenu,
  hideActionMenu,
  isMenuVisible
} from 'drive/web/modules/actionmenu/duck'
import { getActionableFiles } from 'drive/web/modules/navigation/duck'

import styles from 'drive/styles/filelist'

class FileList extends Component {
  render() {
    const {
      canSort,
      fileActions,
      actionMenuActive,
      actionableFiles,
      showActionMenu,
      hideActionMenu,
      ...rest
    } = this.props
    const actionable = fileActions !== undefined
    return (
      <div className={styles['fil-content-table']} role="table">
        <MobileFileListHeader canSort={canSort} />
        <FileListHeader canSort={canSort} />
        <FileListBody
          actionable={actionable}
          showActionMenu={showActionMenu}
          {...rest}
        />
        {actionMenuActive && (
          <FileActionMenu
            files={actionableFiles}
            actions={fileActions}
            onClose={hideActionMenu}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  actionableFiles: getActionableFiles(state),
  actionMenuActive: isMenuVisible(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showActionMenu: fileId => dispatch(showActionMenu(fileId)),
  hideActionMenu: () => dispatch(hideActionMenu())
})

export default connect(mapStateToProps, mapDispatchToProps)(FileList)
