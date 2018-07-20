import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'
import SharingProvider from 'sharing'
import {
  toggleItemSelection,
  isSelectionBarVisible,
  showSelectionBar
} from '../ducks/selection'
import { showActionMenu, hideActionMenu } from '../ducks/actionmenu'
import { addToUploadQueue } from '../ducks/upload'
import {
  openFolder,
  getOpenedFolderId,
  fetchRecentFiles,
  fetchSharings,
  fetchMoreFiles,
  openLocalFile,
  uploadedFile,
  uploadQueueProcessed
} from '../actions'
import {
  getFolderIdFromRoute,
  getVisibleFiles,
  getSelectedFiles,
  getActionableFiles,
  isActionMenuVisible,
  isNavigating
} from '../reducers'

const isRecentFilesView = props => props.location.pathname.match(/^\/recent/)
const isSharingsFilesView = props =>
  props.location.pathname.match(/^\/sharings/)

const urlHasChanged = (props, newProps) =>
  props.location.pathname !== newProps.location.pathname

const isUrlMatchingOpenedFolder = (props, openedFolderId) =>
  openedFolderId &&
  openedFolderId === getFolderIdFromRoute(props.location, props.params)

class FileExplorer extends Component {
  componentWillMount() {
    if (isRecentFilesView(this.props)) {
      this.props.fetchRecentFiles()
    } else if (isSharingsFilesView(this.props)) {
      this.props.fetchSharings()
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
      !isSharingsFilesView(newProps) &&
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
    return (
      <SharingProvider doctype="io.cozy.files" documentType="Files">
        {React.cloneElement(React.Children.only(children), props)}
      </SharingProvider>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isNavigating: isNavigating(state),
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
  showSelectionBar: () => dispatch(showSelectionBar()),
  showActionMenu: fileId => dispatch(showActionMenu(fileId)),
  hideActionMenu: () => dispatch(hideActionMenu()),
  fetchRecentFiles: () => dispatch(fetchRecentFiles()),
  fetchSharings: () => dispatch(fetchSharings()),
  fetchMoreFiles: (folderId, skip, limit) =>
    dispatch(fetchMoreFiles(folderId, skip, limit)),
  onFolderOpen: folderId => dispatch(openFolder(folderId)),
  onFileOpen: file => {
    if (file.availableOffline) {
      return dispatch(openLocalFile(file))
    }
    const viewPath = ownProps.location.pathname
    ownProps.router.push(`${viewPath}/file/${file.id}`)
  },
  onFileToggle: (file, selected) =>
    dispatch(toggleItemSelection(file, selected)),
  uploadFiles: (files, folderId) => {
    dispatch(
      addToUploadQueue(
        files,
        folderId,
        file => dispatch(uploadedFile(file)),
        (loaded, quotas, conflicts, networkErrors, errors) =>
          uploadQueueProcessed(
            loaded,
            quotas,
            conflicts,
            networkErrors,
            errors,
            ownProps.t
          )
      )
    )
  }
})

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(FileExplorer))
)
