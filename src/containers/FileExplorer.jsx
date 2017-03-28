import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { getFolderIdFromRoute } from '../reducers'

import { openFolder, openFileInNewTab, toggleFileSelection, showFileActionMenu } from '../actions'
import { getVisibleFiles, getSelectedFiles, mustShowSelectionBar, mustShowAddFolder } from '../reducers'

const urlHasChanged = (props, newProps) =>
  props.location.pathname !== newProps.location.pathname

const isUrlMatchingDisplayedFolder = (props, displayedFolder) =>
  displayedFolder && displayedFolder.id === getFolderIdFromRoute(props.location, props.params)

class FileExplorer extends Component {
  componentWillMount () {
    this.props.onFolderOpen(
      getFolderIdFromRoute(this.props.location, this.props.params)
    )
  }

  componentWillReceiveProps (newProps) {
    if (urlHasChanged(this.props, newProps) &&
      !isUrlMatchingDisplayedFolder(newProps, this.props.displayedFolder)) {
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
  fetchStatus: state.view.fetchStatus,
  isAddingFolder: mustShowAddFolder(state), // not fan of this...
  showSelection: mustShowSelectionBar(state),
  showDeleteConfirmation: state.ui.showDeleteConfirmation,
  showActionMenu: state.ui.showFileActionMenu,
  files: getVisibleFiles(state),
  selected: getSelectedFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFolderOpen: (folderId) =>
    dispatch(openFolder(folderId)),
  onFileOpen: (parentFolder, file) =>
    dispatch(openFileInNewTab(parentFolder, file)),
  onFileToggle: (file, selected) =>
    dispatch(toggleFileSelection(file, selected)),
  onHideSelectionBar: () =>
    dispatch(hideSelectionBar()),
  onShowActionMenu: (fileId) =>
    dispatch(showFileActionMenu(fileId))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FileExplorer))
