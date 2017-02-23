import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { openFolder, createFolder, renameFolder, abortAddFolder, deleteFileOrFolder, toggleFileSelection, showFileActionMenu } from '../actions'
import { getVisibleFiles, mustShowSelectionBar, isBrowsingTrash } from '../reducers'
import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'

import Empty from '../components/Empty'
import Oops from '../components/Oops'
import FileList from '../components/FileList'

import FilesSelectionBar from '../containers/FilesSelectionBar'
import TrashSelectionBar from '../containers/TrashSelectionBar'
import FileActionMenu from '../containers/FileActionMenu'
import DeleteConfirmation from '../containers/DeleteConfirmation'

const isDir = attrs => attrs.type === 'directory'

const FILES_CONTEXT = 'files'
const TRASH_CONTEXT = 'trash'

class Folder extends Component {
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
      return (
        <div role='contentinfo'>
          <p>Loading</p>
        </div>
      )
    }
    const isTrashContext = props.context === TRASH_CONTEXT
    const { showSelection, showDeleteConfirmation, error, files, showActionMenu } = props
    return (
      <div role='contentinfo'>
        {!isTrashContext && showSelection && <FilesSelectionBar />}
        {isTrashContext && showSelection && <TrashSelectionBar />}
        {showDeleteConfirmation && <DeleteConfirmation />}
        <FileList {...props} {...state} />
        {error && <Oops />}
        {files.length === 0 && <Empty canUpload={!isTrashContext} />}
        {showActionMenu && <FileActionMenu />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  error: state.ui.error,
  showSelection: mustShowSelectionBar(state),
  showDeleteConfirmation: state.ui.showDeleteConfirmation,
  showActionMenu: state.ui.showFileActionMenu,
  files: getVisibleFiles(state),
  folderId: state.ui.currentFolderId
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: () => {
    let folderId
    if (ownProps.params.file !== undefined) {
      folderId = ownProps.params.file
    } else {
      folderId = ownProps.context === TRASH_CONTEXT
        ? TRASH_DIR_ID
        : ROOT_DIR_ID
    }
    dispatch(openFolder(folderId, true))
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
  onFileEdit: (val, attrs) => {
    if (isDir(attrs)) {
      dispatch(renameFolder(val, attrs.id))
      if (attrs.isNew) dispatch(createFolder(val, attrs.id))
    }
  },
  onFileEditAbort: (accidental, attrs) => {
    if (isDir(attrs) && attrs.isNew) {
      dispatch(abortAddFolder(accidental))
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
