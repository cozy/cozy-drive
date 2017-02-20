import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { openFolder, toggleFileSelection, showFileActionMenu } from '../actions'
import { getVisibleFiles, mustShowSelectionBar, isBrowsingTrash } from '../reducers'
import { TRASH_DIR_ID } from '../constants/config'

import FileList from '../components/FileList'

class Trash extends Component {
  componentWillMount () {
    this.props.onMount()
  }

  componentWillReceiveProps (newProps) {
    if (this.props.params.file !== undefined && // we're not in the root dir
      newProps.params.file !== this.props.params.file && // the route has changed
      newProps.params.file !== newProps.folderId) { // but the folder has not been fetched
      this.props.onRouteChange(newProps.params.file)
    }
  }

  render (props, state) {
    if (props.isFetching === true) {
      return <p>Loading</p>
    }
    return <FileList {...props} {...state} />
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  error: state.ui.error,
  showSelection: mustShowSelectionBar(state),
  isBrowsingTrash: isBrowsingTrash(state),
  showActionMenu: state.ui.showFileActionMenu,
  files: getVisibleFiles(state),
  folderId: state.ui.currentFolderId
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: () => {
    dispatch(openFolder(ownProps.params.file || TRASH_DIR_ID, true))
  },
  onRouteChange: (folderId) => {
    dispatch(openFolder(folderId, true))
  },
  onFolderOpen: (folderId) => {
    dispatch(openFolder(folderId, false, ownProps.router))
  },
  onFileToggle: (id, selected) => {
    dispatch(toggleFileSelection(id, selected))
  },
  onShowActionMenu: (fileId) => {
    dispatch(showFileActionMenu(fileId))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Trash))
