import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from '../lib/I18n'

import { openFolder, renameFolder, toggleFileSelection, showFileActionMenu, alertClosed } from '../actions'
import { getVisibleFiles, mustShowSelectionBar } from '../reducers'
import { TRASH_CONTEXT } from '../constants/config'

import Alerter from 'cozy-ui/react/Alerter'

import Loading from '../components/Loading'
import Empty from '../components/Empty'
import Oops from '../components/Oops'
import FileList from '../components/FileList'

import FilesSelectionBar from '../containers/FilesSelectionBar'
import TrashSelectionBar from '../containers/TrashSelectionBar'
import FileActionMenu from '../containers/FileActionMenu'
import DeleteConfirmation from '../containers/DeleteConfirmation'

const isDir = attrs => attrs.type === 'directory'

class Folder extends Component {
  componentWillMount () {
    if (!this.props.isFetching) {
      this.props.onMount()
      this.props.onAlertClose()
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
    const isTrashContext = props.context === TRASH_CONTEXT
    const { t, alert, showSelection, showDeleteConfirmation, error, files, showActionMenu } = props
    return (
      <div role='contentinfo'>
        {alert && <Alerter
          type={alert.type}
          message={t(alert.message, alert.messageData)}
          onClose={this.props.onAlertAutoClose}
          />
        }
        {!isTrashContext && showSelection && <FilesSelectionBar />}
        {isTrashContext && showSelection && <TrashSelectionBar />}
        {showDeleteConfirmation && <DeleteConfirmation />}
        <FileList {...props} {...state} />
        {error && <Oops />}
        {files.length === 0 && <Empty canUpload={!isTrashContext} />}
        {showActionMenu && <FileActionMenu />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.ui.isFetching,
  showLoading: state.ui.isFetching && state.folder === null,
  alert: state.ui.alert,
  error: state.ui.error,
  showSelection: mustShowSelectionBar(state),
  showDeleteConfirmation: state.ui.showDeleteConfirmation,
  showActionMenu: state.ui.showFileActionMenu,
  files: getVisibleFiles(state)
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: () => {
    dispatch(openFolder(ownProps.params.folderId, ownProps.context))
  },
  onRouteChange: (folderId, context) => {
    dispatch(openFolder(folderId, context))
  },
  onFolderOpen: (folderId) => {
    return dispatch(openFolder(folderId, ownProps.context))
  },
  onFileToggle: (id, selected) => {
    dispatch(toggleFileSelection(id, selected))
  },
  onFileEdit: (val, attrs) => {
    if (isDir(attrs)) {
      dispatch(renameFolder(val, attrs.id))
    }
  },
  onShowActionMenu: (fileId) => {
    dispatch(showFileActionMenu(fileId))
  },
  onAlertClose: () => {
    dispatch(alertClosed())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(withRouter(Folder)))
