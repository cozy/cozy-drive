import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { Content, Overlay } from 'cozy-ui/react'
import FileList from 'drive/web/modules/filelist/FileList'
import Main from 'drive/web/modules/layout/Main'
import Topbar from 'drive/web/modules/layout/Topbar'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb'
import ErrorShare from 'components/Error/ErrorShare'
import PublicToolbar from './PublicToolbar'

import {
  openFolder,
  getOpenedFolderId,
  getFolderIdFromRoute,
  fetchMoreFiles,
  getVisibleFiles,
  getFolderUrl
} from 'drive/web/modules/navigation/duck'

import Viewer from 'viewer'
import { FILES_FETCH_LIMIT } from 'drive/constants/config'

class DumbFolderView extends React.Component {
  state = {
    revoked: false,
    viewerOpened: false,
    currentViewedIndex: null
  }

  showInViewer = file => {
    const { files, fileCount, params, location, fetchMoreFiles } = this.props
    const currentIndex = this.props.files.findIndex(f => f.id === file.id)
    this.setState(state => ({
      ...state,
      viewerOpened: true,
      currentViewedIndex: currentIndex
    }))
    if (files.length !== fileCount && files.length - currentIndex <= 5) {
      const folderId = getFolderIdFromRoute(location, params)
      fetchMoreFiles(folderId, files.length, FILES_FETCH_LIMIT)
    }
  }

  closeViewer = () =>
    this.setState(state => ({
      ...state,
      viewerOpened: false,
      currentViewedIndex: null
    }))

  componentWillMount() {
    this.props
      .fetchFolder(getFolderIdFromRoute(this.props.location, this.props.params))
      .then(e => {
        if (e.type === 'OPEN_FOLDER_FAILURE') {
          this.setState(state => ({ ...state, revoked: true }))
        }
      })
  }

  navigateToFolder = async folderId => {
    await this.props.fetchFolder(folderId)
    this.props.router.push(getFolderUrl(folderId, this.props.location))
  }

  render() {
    if (this.state.revoked) {
      return <ErrorShare errorType={`public_unshared`} />
    }
    const { viewerOpened, currentViewedIndex } = this.state

    return (
      <Main isPublic>
        <Topbar>
          <Breadcrumb isPublic />
          <PublicToolbar files={[this.props.displayedFolder]} isFile={false} />
        </Topbar>
        <Content>
          <FileList
            onFileOpen={this.showInViewer}
            onFolderOpen={this.navigateToFolder}
            withSelectionCheckbox={false}
            {...this.props}
          />
          {viewerOpened && (
            <Overlay>
              <Viewer
                files={this.props.files}
                currentIndex={currentViewedIndex}
                onChange={this.showInViewer}
                onClose={this.closeViewer}
              />
            </Overlay>
          )}
        </Content>
      </Main>
    )
  }
}

const mapStateToProps = state => ({
  displayedFolder: state.view.displayedFolder,
  openedFolderId: getOpenedFolderId(state),
  fileCount: state.view.fileCount,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = dispatch => ({
  fetchMoreFiles: (folderId, skip, limit) =>
    dispatch(fetchMoreFiles(folderId, skip, limit)),
  fetchFolder: folderId => dispatch(openFolder(folderId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DumbFolderView))
