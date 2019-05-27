import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'cozy-ui/react/I18n'
import SharingProvider from 'sharing'
import RealtimeFiles from './RealtimeFiles'
import {
  openFolder,
  getOpenedFolderId,
  fetchRecentFiles,
  fetchMoreFiles,
  getFolderIdFromRoute,
  getVisibleFiles,
  getFolderUrl,
  isRecentViewSelector,
  isSharingsViewSelector
} from 'drive/web/modules/navigation/duck'
import { openLocalFile } from 'drive/mobile/modules/offline/duck'

const isRecentFilesViewByPath = props =>
  props.location.pathname.match(/^\/recent/)
const isSharingsFilesViewByPath = props =>
  props.location.pathname.match(/^\/sharings/) && !props.params.folderId

const urlHasChanged = (props, newProps) =>
  props.location.pathname !== newProps.location.pathname

const isUrlMatchingOpenedFolder = (props, openedFolderId) => {
  return (
    openedFolderId &&
    openedFolderId === getFolderIdFromRoute(props.location, props.params)
  )
}

class FileExplorer extends Component {
  componentWillMount() {
    const {
      isRecentFilesView,
      isSharingsFilesView,
      location,
      params
    } = this.props
    if (isRecentFilesView) {
      this.props.fetchRecentFiles()
    } else if (isSharingsFilesView) {
      // Do nothing — the fetching will be started by a sub-component
    } else {
      this.props.fetchFolder(getFolderIdFromRoute(location, params))
    }
  }

  /*
    We need this method since <Nav is using href and not onClick
    and we listen to the URL changes in order to call the right action 

    This is only needed for this case, since the navigation in a Folder 
    is managed by navigateToFolder function.

    We should perhaps have : 
    - FileFolderExplorer 
    - RecentFileExplorer 
    - TrashFileExplorer ?

    We have to use newProps and newProps.location, because has we use both : 
    - props location 
    and 
    - redux store 
    props.location is the first to be updated 

    Also we check the matching between the openedFilderId (and not the displayFolderId)
    and the new props location (folder id in the url)
  */
  componentWillReceiveProps(newProps) {
    if (
      urlHasChanged(this.props, newProps) &&
      !isRecentFilesViewByPath(newProps) &&
      !isSharingsFilesViewByPath(newProps) &&
      !isUrlMatchingOpenedFolder(newProps, this.props.openedFolderId)
    ) {
      this.navigateToFolder(
        getFolderIdFromRoute(newProps.location, newProps.params)
      )
    } else if (
      urlHasChanged(this.props, newProps) &&
      isSharingsFilesViewByPath(newProps)
    ) {
      this.props.fetchRecentFiles()
    }
  }

  /*
   @performance 

    Thanks to this, we're updating twice the redux store and we cause
    a lof of re-render issues

    Very deep in the three (File.jsx), we use navigateToForlder renamed as 
    openFolder. 
  */
  navigateToFolder = async folderId => {
    await this.props.fetchFolder(folderId)
    this.props.router.push(getFolderUrl(folderId, this.props.location))
  }

  render() {
    const { children, ...otherProps } = this.props
    return (
      <RealtimeFiles>
        <SharingProvider doctype="io.cozy.files" documentType="Files">
          {React.cloneElement(React.Children.only(children), {
            ...otherProps,
            onFolderOpen: this.navigateToFolder
          })}
        </SharingProvider>
      </RealtimeFiles>
    )
  }
}

const mapStateToProps = state => ({
  displayedFolder: state.view.displayedFolder,
  openedFolderId: getOpenedFolderId(state),
  fileCount: state.view.fileCount,
  files: getVisibleFiles(state),
  isSharingsFilesView: isSharingsViewSelector(state),
  isRecentFilesView: isRecentViewSelector(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchRecentFiles: () => dispatch(fetchRecentFiles()),
  fetchMoreFiles: (folderId, skip, limit) =>
    dispatch(fetchMoreFiles(folderId, skip, limit)),
  fetchFolder: folderId => dispatch(openFolder(folderId)),
  onFileOpen: (file, availableOffline) => {
    if (availableOffline) {
      return dispatch(openLocalFile(file))
    }
    const viewPath = ownProps.location.pathname
    ownProps.router.push(`${viewPath}/file/${file.id}`)
  }
})

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(FileExplorer))
)
