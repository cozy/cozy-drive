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
  openFileWith,
  downloadSelection,
  renameSelection,
  rename,
  abortRename,
  trashFiles
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
      abortAddFolder: accidental => dispatch(abortAddFolder(accidental)),
      rename: (file, name) => dispatch(rename(file, name)),
      abortRename: name => dispatch(abortRename())
    },
    mobile: {
      openWith: file => dispatch(openFileWith(file.id, file.name))
    },
    selection: {
      download: files => dispatch(downloadSelection(files)),
      trash: files =>
        confirm(<DeleteConfirm t={ownProps.t} fileCount={files.length} />)
          .then(() => dispatch(trashFiles(files)))
          .catch(() => {})
    },
    singleSelection: {
      rename: selected => dispatch(renameSelection(selected[0]))
    }
  })
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView))
