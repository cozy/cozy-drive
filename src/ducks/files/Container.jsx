import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../lib/I18n'
import confirm from '../../lib/confirm'

import FolderView from '../../components/FolderView'
import DeleteConfirm from '../../components/DeleteConfirm'
import Toolbar from './Toolbar'

import {
  createFolder,
  abortAddFolder,
  downloadSelection,
  trashFiles,
  hideFileActionMenu
} from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: false,
  canUpload: true,
  Toolbar
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  actions: Object.assign({}, ownProps.actions, {
    list: {
      createFolder: name => dispatch(createFolder(name)),
      // TODO: a bit sad of dispatching an action only to show an alert...
      // we should find a better way...
      abortAddFolder: accidental => dispatch(abortAddFolder(accidental))
    },
    selection: {
      download: () => dispatch(downloadSelection(ownProps.selected)),
      trash: () => confirm(
        <DeleteConfirm t={ownProps.t} fileCount={ownProps.actionable.length} />
      ).then(() => {
        dispatch(trashFiles(ownProps.actionable))
        dispatch(hideFileActionMenu())
      })
    }
  })
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView))
