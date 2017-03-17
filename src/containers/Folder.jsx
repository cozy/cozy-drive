/* global __TARGET__ */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import { openFolder, openFileInNewTab, renameFolder, toggleFileSelection, showFileActionMenu } from '../actions'
import { getVisibleFiles, mustShowSelectionBar } from '../reducers'
import { TRASH_CONTEXT } from '../constants/config'

import { Alerter } from 'cozy-ui/react/Alerter'

import styles from '../styles/table'

import Loading from '../components/Loading'
import Empty from '../components/Empty'
import Oops from '../components/Oops'
import FileListHeader from '../components/FileListHeader'
import FileList from '../components/FileList'
import UploadProgression from '../../mobile/src/containers/UploadProgression'

import FilesSelectionBar from '../containers/FilesSelectionBar'
import TrashSelectionBar from '../containers/TrashSelectionBar'
import FileActionMenu from '../containers/FileActionMenu'
import DeleteConfirmation from '../containers/DeleteConfirmation'

const isDir = attrs => attrs.type === 'directory'

class Folder extends Component {
  componentWillMount () {
    if (!this.props.isFetching) {
      this.props.onMount()
    }
  }

  componentWillReceiveProps (newProps) {
    // if we're already fetching, that's because of a 'openFolder' call
    // no need to check if the URL has changed
    if (this.props.isFetching || newProps.isFetching) return
    // let's check now!
    if (newProps.context !== this.props.context ||
      newProps.params.folderId !== this.props.params.folderId) {
      this.props.onRouteChange(newProps.params.folderId, newProps.context)
    }
  }

  render (props, state) {
    if (props.showLoading === true) {
      return (
        <Loading message={props.t('loading.message')} />
      )
    }
    const isTrashContext = props.visibleContext === TRASH_CONTEXT
    const { showSelection, showDeleteConfirmation, error, files, showActionMenu } = props
    return (
      <div role='contentinfo'>
        <Alerter />
        {__TARGET__ === 'mobile' && <UploadProgression /> }
        {!isTrashContext && showSelection && <FilesSelectionBar />}
        {isTrashContext && showSelection && <TrashSelectionBar />}
        {showDeleteConfirmation && <DeleteConfirmation />}
        <div className={classNames(
          styles['fil-content-table'],
          { [styles['fil-content-table-selection']]: showSelection }
        )}>
          <FileListHeader />
          <div className={styles['fil-content-body']}>
            <FileList {...props} {...state} isTrashContext={isTrashContext} />
            {!error && files.length === 0 && <Empty canUpload={!isTrashContext} />}
            {error && <Oops />}
          </div>
        </div>
        {showActionMenu && <FileActionMenu isTrashContext={isTrashContext} />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  visibleContext: state.context,
  isFetching: state.ui.isFetching,
  showLoading: state.ui.isFetching && state.folder === null,
  error: state.ui.error,
  showSelection: mustShowSelectionBar(state),
  showDeleteConfirmation: state.ui.showDeleteConfirmation,
  showActionMenu: state.ui.showFileActionMenu,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: () =>
    dispatch(openFolder(ownProps.params.folderId, ownProps.context)),
  onRouteChange: (folderId, context) =>
    dispatch(openFolder(folderId, context)),
  onFolderOpen: (folderId) =>
    dispatch(openFolder(folderId, ownProps.context)),
  onFileOpen: (file) =>
    dispatch(openFileInNewTab(file)),
  onFileToggle: (id, selected) =>
    dispatch(toggleFileSelection(id, selected)),
  onFileEdit: (val, attrs) => {
    if (isDir(attrs)) {
      dispatch(renameFolder(val, attrs.id))
    }
  },
  onShowActionMenu: (fileId) =>
    dispatch(showFileActionMenu(fileId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(withRouter(Folder)))
