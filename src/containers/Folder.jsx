import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { openFolder, createFolder, renameFolder, abortAddFolder, deleteFileOrFolder, toggleFileSelection, showFileActionMenu } from '../actions'
import { getVisibleFiles, mustShowSelectionBar } from '../reducers'

import FileList from '../components/FileList'

const isDir = attrs => attrs.type === 'directory'

class Folder extends Component {
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
  showDeleteConfirmation: state.ui.showDeleteConfirmation,
  showActionMenu: state.ui.showFileActionMenu,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFolderOpen: (folderId) => {
    dispatch(openFolder(folderId, false, ownProps.router))
  },
  onFileToggle: (id, selected) => {
    dispatch(toggleFileSelection(id, selected))
  },
  onFileEdit: (val, attrs) => {
    if (isDir(attrs)){
      dispatch(renameFolder(val, attrs.id))
      if (attrs.isNew) dispatch(createFolder(val, attrs.id))
    }
  },
  onFileEditAbort: (accidental, attrs) => {
    if (isDir(attrs) && attrs.isNew) {
      dispatch(abortAddFolder())
      dispatch(deleteFileOrFolder(attrs.id, attrs.isNew))
    }
  },
  onShowActionMenu: (fileId) => {
    dispatch(showFileActionMenu(fileId))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Folder))
