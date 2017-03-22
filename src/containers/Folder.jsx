import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import { openFolder, openFileInNewTab, toggleFileSelection, showFileActionMenu } from '../actions'
import { getVisibleFiles, mustShowSelectionBar, mustShowAddFolder } from '../reducers'
import { TRASH_DIR_ID } from '../constants/config'

import { Alerter } from 'cozy-ui/react/Alerter'

import styles from '../styles/table'

import Loading from '../components/Loading'
import Empty from '../components/Empty'
import Oops from '../components/Oops'
import FileListHeader from '../components/FileListHeader'
import FileList from '../components/FileList'

import FilesSelectionBar from '../containers/FilesSelectionBar'
import TrashSelectionBar from '../containers/TrashSelectionBar'
import FileActionMenu from '../containers/FileActionMenu'
import DeleteConfirmation from '../containers/DeleteConfirmation'

const FolderContent = props => {
  const { fetchStatus, files, isAddingFolder } = props
  const isTrashContext = props.virtualRoot === TRASH_DIR_ID
  switch (fetchStatus) {
    case 'pending':
      return <Loading message={props.t('loading.message')} />
    case 'failed':
      return <Oops />
    case 'loaded':
      return files.length === 0 && !isAddingFolder
        ? <Empty canUpload={!isTrashContext} />
        : <FileList {...props} isTrashContext={isTrashContext} />
  }
}

const Folder = props => {
  const isTrashContext = props.virtualRoot === TRASH_DIR_ID
  const { showSelection, showDeleteConfirmation, showActionMenu } = props
  return (
    <div role='contentinfo'>
      <Alerter />
      {!isTrashContext && showSelection && <FilesSelectionBar />}
      {isTrashContext && showSelection && <TrashSelectionBar />}
      {showDeleteConfirmation && <DeleteConfirmation />}
      <div className={classNames(
        styles['fil-content-table'],
        { [styles['fil-content-table-selection']]: showSelection }
      )}>
        <FileListHeader />
        <div className={styles['fil-content-body']}>
          <FolderContent {...props} />
        </div>
      </div>
      {showActionMenu && <FileActionMenu isTrashContext={isTrashContext} />}
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  virtualRoot: state.view.virtualRoot,
  displayedFolder: state.view.displayedFolder,
  fetchStatus: state.view.fetchStatus,
  // error: state.ui.error,
  isAddingFolder: mustShowAddFolder(state), // not fan of this...
  showSelection: mustShowSelectionBar(state),
  showDeleteConfirmation: state.ui.showDeleteConfirmation,
  showActionMenu: state.ui.showFileActionMenu,
  files: getVisibleFiles(state),
  selected: state.ui.selected
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFolderOpen: (virtualRoot, folderId) =>
    dispatch(openFolder(virtualRoot, folderId)),
  onFileOpen: (parentFolder, file) =>
    dispatch(openFileInNewTab(parentFolder, file)),
  onFileToggle: (id, selected) =>
    dispatch(toggleFileSelection(id, selected)),
  onShowActionMenu: (fileId) =>
    dispatch(showFileActionMenu(fileId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(withRouter(Folder)))
