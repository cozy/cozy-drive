import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { models, withClient } from 'cozy-client'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import SharingProvider from 'cozy-sharing'
import RealtimeFiles from './RealtimeFiles'
import {
  openFolder,
  getOpenedFolderId,
  fetchRecentFiles,
  fetchMoreFiles,
  getFolderIdFromRoute,
  getVisibleFiles,
  getFolderUrl
} from 'drive/web/modules/navigation/duck'
import { openLocalFile } from 'drive/mobile/modules/offline/duck'
import {
  OPEN_FOLDER_FROM_TRASH,
  OPEN_FOLDER_FROM_TRASH_SUCCESS,
  OPEN_FOLDER_FROM_TRASH_FAILURE
} from 'drive/web/modules/trash/actions'

const isRecentFilesViewByPath = props =>
  props.location.pathname.match(/^\/recent/)
const isSharingsFilesViewByPath = props =>
  props.location.pathname.match(/^\/sharings/)
const isTrashFilesViewByPath = props =>
  props.location.pathname.match(/^\/trash/)
const urlHasChanged = (props, newProps) =>
  props.location.pathname !== newProps.location.pathname

const isUrlMatchingOpenedFolder = (props, openedFolderId) => {
  return (
    openedFolderId &&
    openedFolderId === getFolderIdFromRoute(props.location, props.params)
  )
}

export class DumbFileExplorer extends Component {
  /*
    This function is needed when the user comes to a "deep" url without clicking
    on the nav button. Acceding to /drive/4e33fd27e1d8e55a34742bac6d0dd120 directly
    for instance.

  TODO: It should not be the responsability to the FileExplorer to do the right request.
  It should be done by the "Container" itself. It's already done by the SharingsContainer
  */
  componentWillMount() {
    const { location, params } = this.props
    if (isRecentFilesViewByPath(this.props)) {
      this.props.fetchRecentFiles()
    } else if (isSharingsFilesViewByPath(this.props)) {
      // Do nothing — the fetching will be started by a sub-component
    } else if (isTrashFilesViewByPath(this.props)) {
      this.props.fetchFolderFromTrash(getFolderIdFromRoute(location, params))
    } else {
      this.props.fetchFolder(getFolderIdFromRoute(location, params))
    }
  }

  /*
    We need this method since the Nav component is using href and not onClick
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

    I can't use isRecentFilesView for instance, since when we click on the "Recent" links
    we don't dispatch any action. We're just listeninng the URL, and dispatch the action
    if the url has changed and that we're on the /recent url
  */
  componentWillReceiveProps(newProps) {
    //As we're url based here, if nothing changed, let's shortcut
    if (!urlHasChanged(this.props, newProps)) return

    //if url has changed and the new one is Recent
    if (isRecentFilesViewByPath(newProps)) {
      return this.props.fetchRecentFiles()
    }

    //if url has changed and we're not on the recent, not on the sharings
    // and the desired folder is different than the opened... Let's navigate
    // to it
    // Didn't try, but I think here we can use props.openedFolderId !== newprops.openedFolderId
    if (
      !isSharingsFilesViewByPath(newProps) &&
      !isUrlMatchingOpenedFolder(newProps, this.props.openedFolderId)
    ) {
      if (isTrashFilesViewByPath(newProps)) {
        this.props.fetchFolderFromTrash(
          getFolderIdFromRoute(newProps.location, newProps.params)
        )
      } else {
        this.props.fetchFolder(
          getFolderIdFromRoute(newProps.location, newProps.params)
        )
      }
    }
  }

  /*
   @performance

    Thanks to this, we're updating twice the redux store (url and fetchfolder)
    and we cause a lof of re-render issues

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
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  // These functions are needed here to dispatch actions when the URL changes, but they should be in the Containers below.
  fetchRecentFiles: () => dispatch(fetchRecentFiles()),
  fetchMoreFiles: (folderId, skip, limit) =>
    dispatch(fetchMoreFiles(folderId, skip, limit)),
  fetchFolder: folderId => dispatch(openFolder(folderId)),
  fetchFolderFromTrash: folderId =>
    dispatch(
      openFolder(
        folderId,
        OPEN_FOLDER_FROM_TRASH,
        OPEN_FOLDER_FROM_TRASH_SUCCESS,
        OPEN_FOLDER_FROM_TRASH_FAILURE
      )
    ),
  onFileOpen: (file, availableOffline) => {
    handleFileOpen(file, availableOffline, ownProps, dispatch)
  }
})

export const handleFileOpen = async (
  file,
  availableOffline,
  props,
  dispatch
) => {
  const redirectToViewer = () => {
    const viewPath = props.location.pathname
    props.router.push(`${viewPath}/file/${file.id}`)
  }
  if (availableOffline) {
    return dispatch(openLocalFile(file))
  }
  const isNote = models.file.isNote(file)
  const isShortcut = models.file.isShortcurt(file)
  const { client } = props
  //Should only be called if mobile
  if (isShortcut) {
    const resp = await client
      .getStackClient()
      .fetchJSON('GET', `/shortcuts/${file.id}`)
    window.location.href = resp.data.attributes.url
  } else if (isNote) {
    try {
      window.location.href = await models.note.fetchURL(client, file)
    } catch (e) {
      Alerter.error('alert.offline')
    }
  } else {
    redirectToViewer()
  }
}

export default compose(
  translate(),
  withRouter,
  withClient,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(DumbFileExplorer)
