import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'
import SharingProvider from 'sharing'
import RealtimeFiles from './RealtimeFiles'
import {
  toggleItemSelection,
  isSelectionBarVisible,
  showSelectionBar
} from 'drive/web/modules/selection/duck'
import {
  openFolder,
  getOpenedFolderId,
  fetchRecentFiles,
  fetchMoreFiles,
  openLocalFile,
  uploadFiles,
  getFolderIdFromRoute,
  getVisibleFiles,
  getSelectedFiles
} from 'drive/web/modules/navigation/duck'

const isRecentFilesView = props => props.location.pathname.match(/^\/recent/)
const isSharingsFilesView = props =>
  props.location.pathname.match(/^\/sharings/) && !props.params.folderId

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
      // Do nothing — the fetching will be started by a sub-component
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
    } else if (
      urlHasChanged(this.props, newProps) &&
      isRecentFilesView(newProps)
    ) {
      this.props.fetchRecentFiles()
    }
  }

  openFolder(folderId) {
    this.props.onFolderOpen(folderId)
  }

  render() {
    const { children, ...props } = this.props
    return (
      <RealtimeFiles>
        <SharingProvider doctype="io.cozy.files" documentType="Files">
          {React.cloneElement(React.Children.only(children), props)}
        </SharingProvider>
      </RealtimeFiles>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder,
  openedFolderId: getOpenedFolderId(state),
  fileCount: state.view.fileCount,
  requestedFiles: state.view.requestedFiles,
  files: getVisibleFiles(state),
  selected: getSelectedFiles(state),
  selectionModeActive: isSelectionBarVisible(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  showSelectionBar: () => dispatch(showSelectionBar()),
  fetchRecentFiles: () => dispatch(fetchRecentFiles()),
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
    dispatch(uploadFiles(files, folderId))
  }
})

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(FileExplorer))
)
