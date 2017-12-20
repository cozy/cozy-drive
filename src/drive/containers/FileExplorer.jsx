import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { withClient, fetchSharings, getSharingDetails } from 'cozy-client'

import {
  toggleItemSelection,
  isSelectionBarVisible,
  showSelectionBar
} from '../ducks/selection'
import { showActionMenu, hideActionMenu } from '../ducks/actionmenu'
import {
  openFolder,
  getOpenedFolderId,
  fetchRecentFiles,
  fetchMoreFiles,
  openFileInNewTab
} from '../actions'
import {
  getFolderIdFromRoute,
  getVisibleFiles,
  getSelectedFiles,
  getActionableFiles,
  isActionMenuVisible
} from '../reducers'

const isRecentFilesView = props => props.location.pathname.match(/^\/recent/)

const urlHasChanged = (props, newProps) =>
  props.location.pathname !== newProps.location.pathname

const isUrlMatchingOpenedFolder = (props, openedFolderId) =>
  openedFolderId &&
  openedFolderId === getFolderIdFromRoute(props.location, props.params)

class FileExplorer extends Component {
  componentWillMount() {
    this.props.fetchSharings()
    if (isRecentFilesView(this.props)) {
      this.props.fetchRecentFiles()
    } else {
      this.openFolder(
        getFolderIdFromRoute(this.props.location, this.props.params)
      )
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      urlHasChanged(this.props, newProps) &&
      !isRecentFilesView(newProps) &&
      !isUrlMatchingOpenedFolder(newProps, this.props.openedFolderId)
    ) {
      this.openFolder(getFolderIdFromRoute(newProps.location, newProps.params))
    }
  }

  openFolder(folderId) {
    this.props.onFolderOpen(folderId)
  }

  render() {
    const { children, ...props } = this.props
    return React.cloneElement(React.Children.only(children), props)
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
  shared: getSharingDetails(
    state,
    'io.cozy.files',
    getFolderIdFromRoute(ownProps.location, ownProps.params)
  ),
  selectionModeActive: isSelectionBarVisible(state),
  actionMenuActive: isActionMenuVisible(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showSelectionBar: () => dispatch(showSelectionBar()),
  showActionMenu: fileId => dispatch(showActionMenu(fileId)),
  hideActionMenu: () => dispatch(hideActionMenu()),
  fetchSharings: () => dispatch(fetchSharings('io.cozy.files')),
  fetchRecentFiles: () => dispatch(fetchRecentFiles()),
  fetchMoreFiles: (folderId, skip, limit) =>
    dispatch(fetchMoreFiles(folderId, skip, limit)),
  // TODO: we must pass the client here so that we can fetch the thumbnails links on mobile
  onFolderOpen: folderId => dispatch(openFolder(folderId, ownProps.client)),
  onFileOpen: file => dispatch(openFileInNewTab(file)),
  onFileToggle: (file, selected) =>
    dispatch(toggleItemSelection(file, selected))
})

export default withClient(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(FileExplorer))
)
