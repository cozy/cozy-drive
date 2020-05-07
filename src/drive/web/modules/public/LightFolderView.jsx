import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import get from 'lodash/get'

import { Content, Overlay } from 'cozy-ui/transpiled/react'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { models, withClient } from 'cozy-client'
import { ModalManager } from 'react-cozy-helpers'

import Main from 'drive/web/modules/layout/Main'
import Topbar from 'drive/web/modules/layout/Topbar'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb'
import ErrorShare from 'components/Error/ErrorShare'
import PublicToolbar from './PublicToolbar'
import LightFileList from './LightFileList'

import {
  openFolder,
  getOpenedFolderId,
  getFolderIdFromRoute,
  fetchMoreFiles,
  getVisibleFiles,
  getFolderUrl
} from 'drive/web/modules/navigation/duck'

import { FILES_FETCH_LIMIT } from 'drive/constants/config'
import Viewer from 'drive/web/modules/viewer/PublicViewer'
import { isMobileApp } from 'cozy-device-helper'

class DumbFolderView extends React.Component {
  state = {
    revoked: false,
    viewerOpened: false,
    currentViewedIndex: null,
    hasWriteAccess: false
  }
  handleFileOpen = async file => {
    const isNote = models.file.isNote(file)
    const { client } = this.props
    if (isNote) {
      try {
        const noteUrl = await models.note.fetchURL(client, file)
        const url = new URL(noteUrl)
        if (!isMobileApp()) {
          url.searchParams.set('returnUrl', window.location.href)
        }
        window.location.href = url.toString()
      } catch (e) {
        Alerter.error('alert.offline')
      }
    } else {
      this.showInViewer(file)
    }
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
    this.loadCurrentFolder()
    this.loadPermissions()
  }

  loadCurrentFolder = () => {
    this.props
      .fetchFolder(getFolderIdFromRoute(this.props.location, this.props.params))
      .then(e => {
        if (e.type === 'OPEN_FOLDER_FAILURE') {
          this.setState(state => ({ ...state, revoked: true }))
        }
      })
  }

  loadPermissions = async () => {
    const { client } = this.props
    const response = await client
      .collection('io.cozy.permissions')
      .getOwnPermissions()
    const permission = get(response, 'data.attributes.permissions.files', {})
    this.setState({ hasWriteAccess: !models.permission.isReadOnly(permission) })
  }

  navigateToFolder = async folderId => {
    await this.props.fetchFolder(folderId)
    this.props.router.push(getFolderUrl(folderId, this.props.location))
  }

  render() {
    if (this.state.revoked) {
      return <ErrorShare errorType={`public_unshared`} />
    }
    const { viewerOpened, currentViewedIndex, hasWriteAccess } = this.state
    const { children, ...fileListProps } = this.props

    return (
      <Main isPublic>
        <Topbar>
          <Breadcrumb isPublic onFolderOpen={this.props.fetchFolder} />
          <PublicToolbar
            files={[this.props.displayedFolder]}
            isFile={false}
            hasWriteAccess={hasWriteAccess}
          />
        </Topbar>
        <Content>
          <LightFileList
            onFileOpen={this.handleFileOpen}
            onFolderOpen={this.navigateToFolder}
            onFileDelete={this.loadCurrentFolder}
            fileListProps={fileListProps}
          />

          {viewerOpened && (
            <Overlay>
              <Viewer
                files={this.props.files}
                currentIndex={currentViewedIndex}
                onChangeRequest={this.showInViewer}
                onCloseRequest={this.closeViewer}
              />
            </Overlay>
          )}
          {children}
        </Content>
        <ModalManager />
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
)(withRouter(withClient(DumbFolderView)))
