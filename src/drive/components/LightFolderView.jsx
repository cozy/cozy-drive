import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import Main from './Main'
import FolderContent from './FolderContent'
import FileListHeader from './FileListHeader'
import Topbar from './Topbar'
import Breadcrumb from '../containers/Breadcrumb'
import ErrorShare from './ErrorShare'

import DownloadButton from './DownloadButton'
import Menu, { Item } from './Menu'

import {
  openFolder,
  getOpenedFolderId,
  fetchMoreFiles,
  openFileInNewTab,
  downloadFiles
} from '../actions'
import { getVisibleFiles } from '../reducers'

import styles from '../styles/folderview'
import toolbarstyles from '../styles/toolbar'

class DumbFolderView extends React.Component {
  state = {
    revoked: false
  }

  componentWillMount() {
    this.props.onFolderOpen(this.props.params.folderId).then(e => {
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
    return (
      <Main>
        <Topbar>
          <Breadcrumb isPublic />
          <div className={toolbarstyles['fil-toolbar-files']} role="toolbar">
            <DownloadButton
              label={t('toolbar.menu_download_folder')}
              className={toolbarstyles['fil-public-download']}
              onDownload={() =>
                this.props.onDownload([this.props.displayedFolder])}
            />
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
                    this.props.onDownload([this.props.displayedFolder])}
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
              <FolderContent withSelectionCheckbox={false} {...this.props} />
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
  onFileOpen: file => dispatch(openFileInNewTab(file)),
  onDownload: files => dispatch(downloadFiles(files))
})

export default connect(mapStateToProps, mapDispatchToProps)(DumbFolderView)
