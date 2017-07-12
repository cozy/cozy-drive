import React from 'react'
import { connect } from 'react-redux'

import Main from './Main'
import FolderContent from './FolderContent'
import FileListHeader from './FileListHeader'
import Topbar from './Topbar'
import Breadcrumb from '../containers/Breadcrumb'

import {
  openFolder,
  getOpenedFolderId,
  fetchMoreFiles,
  openFileInNewTab
} from '../actions'
import {
  getVisibleFiles
} from '../reducers'

import styles from '../styles/folderview'

class DumbFolderView extends React.Component {
  componentWillMount () {
    this.props.onFolderOpen(this.props.params.folderId)
  }

  render () {
    const props = this.props
    return (
      <Main>
        <Topbar>
          <Breadcrumb />
        </Topbar>
        <div role='contentinfo'>
          <div className={styles['fil-content-table']}>
            <FileListHeader />
            <div className={styles['fil-content-body']}>
              <FolderContent
                withSelectionCheckbox={false}
                {...props}
              />
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
  onFolderOpen: folderId =>
    dispatch(openFolder(folderId)),
  onFileOpen: (parentFolder, file) =>
    dispatch(openFileInNewTab(parentFolder, file))
})

export default connect(mapStateToProps, mapDispatchToProps)(DumbFolderView)
