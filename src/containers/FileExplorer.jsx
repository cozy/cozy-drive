import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import {
  toggleFileSelection,
  showSelectionBar,
  hideSelectionBar
} from '../ducks/selection'
import {
  showActionMenu,
  hideActionMenu
} from '../ducks/actionmenu'
import {
  openFolder,
  getOpenedFolderId,
  fetchMoreFiles,
  openFileInNewTab
} from '../actions'
import {
  getFolderIdFromRoute,
  getVisibleFiles,
  getSelectedFiles,
  getActionableFiles,
  isSelectionBarVisible,
  isActionMenuVisible
} from '../reducers'

const urlHasChanged = (props, newProps) =>
  props.location.pathname !== newProps.location.pathname

const isUrlMatchingOpenedFolder = (props, openedFolderId) =>
  openedFolderId && openedFolderId === getFolderIdFromRoute(props.location, props.params)

class FileExplorer extends Component {
  componentWillMount () {
    this.props.onFolderOpen(
      getFolderIdFromRoute(this.props.location, this.props.params)
    )
  }

  componentWillReceiveProps (newProps) {
    if (urlHasChanged(this.props, newProps) &&
      !isUrlMatchingOpenedFolder(newProps, this.props.openedFolderId)) {
      this.props.onFolderOpen(
        getFolderIdFromRoute(newProps.location, newProps.params)
      )
    }
  }

  render () {
    return React.cloneElement(React.Children.only(this.props.children), this.props)
  }
}

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder,
  openedFolderId: getOpenedFolderId(state),
  fileCount: state.view.fileCount,
  requestedFiles: state.view.requestedFiles,
  fetchStatus: state.view.fetchStatus,
  files: getVisibleFiles(state),
  selected: getSelectedFiles(state),
  actionable: getActionableFiles(state),
  selectionModeActive: isSelectionBarVisible(state),
  actionMenuActive: isActionMenuVisible(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showSelectionBar: () =>
    dispatch(showSelectionBar()),
  hideSelectionBar: () =>
    dispatch(hideSelectionBar()),
  showActionMenu: fileId =>
    dispatch(showActionMenu(fileId)),
  hideActionMenu: () =>
    dispatch(hideActionMenu()),
  fetchMoreFiles: (folderId, skip, limit) =>
    dispatch(fetchMoreFiles(folderId, skip, limit)),
  onFolderOpen: folderId =>
    dispatch(openFolder(folderId)),
  onFileOpen: (parentFolder, file) =>
    dispatch(openFileInNewTab(parentFolder, file)),
  onFileToggle: (file, selected) =>
    dispatch(toggleFileSelection(file, selected))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FileExplorer))
