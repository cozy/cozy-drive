import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Main from './Main'
import FolderContent from './FolderContent'
import FileListHeader from './FileListHeader'
import Topbar from './Topbar'
import Breadcrumb from '../containers/Breadcrumb'
import ErrorShare from 'components/Error/ErrorShare'

import DownloadButton from './DownloadButton'
import { CozyHomeLink } from 'components/Button'
import Menu, { Item } from 'components/Menu'

import {
  openFolder,
  getOpenedFolderId,
  fetchMoreFiles,
  downloadFiles
} from '../actions'
import { getVisibleFiles } from '../reducers'

import styles from '../styles/folderview'
import toolbarstyles from '../styles/toolbar'
import { getFolderIdFromRoute } from '../reducers/view'

import Viewer from 'viewer'

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
      fetchMoreFiles(folderId, files.length, 30)
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
      .onFolderOpen(
        getFolderIdFromRoute(this.props.location, this.props.params)
      )
      .then(e => {
        if (
          e.type === 'OPEN_FOLDER_FAILURE' &&
          /no permission doc for token/.test(e.error.reason.errors[0].detail)
        ) {
          this.setState(state => ({ ...state, revoked: true }))
        }
      })
  }

  render() {
    const { t } = this.context
    if (this.state.revoked) {
      return <ErrorShare errorType={`public_unshared`} />
    }
    const { viewerOpened, currentViewedIndex } = this.state
    return (
      <Main>
        <Topbar>
          <Breadcrumb isPublic />
          <div className={toolbarstyles['fil-toolbar-files']} role="toolbar">
            <DownloadButton
              label={t('toolbar.menu_download_folder')}
              className={toolbarstyles['fil-public-download']}
              onDownload={() =>
                this.props.onDownload([this.props.displayedFolder])
              }
              theme="secondary"
            />
            <CozyHomeLink from="link-sharing-drive" />
            <Menu
              title={t('toolbar.item_more')}
              className={classnames(
                toolbarstyles['fil-toolbar-menu'],
                toolbarstyles['fil-toolbar-menu--public']
              )}
              buttonClassName={toolbarstyles['fil-toolbar-more-btn']}
            >
              <Item>
                <a
                  className={toolbarstyles['fil-action-download']}
                  onClick={() =>
                    this.props.onDownload([this.props.displayedFolder])
                  }
                >
                  {t('toolbar.menu_download_folder')}
                </a>
              </Item>
            </Menu>
          </div>
        </Topbar>
        <div role="contentinfo">
          <div className={styles['fil-content-table']}>
            <FileListHeader />
            <div className={styles['fil-content-body']}>
              <FolderContent
                onFileOpen={this.showInViewer}
                withSelectionCheckbox={false}
                {...this.props}
              />
              {viewerOpened && (
                <Viewer
                  files={this.props.files}
                  currentIndex={currentViewedIndex}
                  onChange={this.showInViewer}
                  onClose={this.closeViewer}
                />
              )}
            </div>
          </div>
        </div>
      </Main>
    )
  }
}

const mapStateToProps = state => ({
  displayedFolder: state.view.displayedFolder,
  openedFolderId: getOpenedFolderId(state),
  fileCount: state.view.fileCount,
  requestedFiles: state.view.requestedFiles,
  fetchStatus: state.view.fetchStatus,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = dispatch => ({
  fetchMoreFiles: (folderId, skip, limit) =>
    dispatch(fetchMoreFiles(folderId, skip, limit)),
  onFolderOpen: folderId => dispatch(openFolder(folderId)),
  onDownload: files => dispatch(downloadFiles(files))
})

export default connect(mapStateToProps, mapDispatchToProps)(DumbFolderView)
