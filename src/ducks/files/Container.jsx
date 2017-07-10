/* global __TARGET__ */
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import confirm from '../../lib/confirm'

import FolderView from '../../components/FolderView'
import DeleteConfirm from '../../components/DeleteConfirm'
import { ShareModal } from '../../ducks/sharing'
import Toolbar from './Toolbar'
import { isRenaming, getRenamingFile, startRenamingAsync } from './rename'
import { isFile } from './files'

import {
  createFolder,
  abortAddFolder,
  openFileWith,
  downloadSelection,
  trashFiles
} from '../../actions'

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: false,
  canUpload: true,
  isRenaming: isRenaming(state),
  renamingFile: getRenamingFile(state),
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
      download: {
        action: files => dispatch(downloadSelection(files))
      },
      trash: {
        action: files => confirm(<DeleteConfirm t={ownProps.t} fileCount={files.length} />)
          .then(() => dispatch(trashFiles(files)))
          .catch(() => {})
      },
      openWith: {
        action: files => dispatch(openFileWith(files[0].id, files[0].name)),
        displayCondition: (selections) => __TARGET__ === 'mobile' && selections.length === 1 && isFile(selections[0])
      },
      rename: {
        action: selected => dispatch(startRenamingAsync(selected[0])),
        displayCondition: (selections) => selections.length === 1 && isFile(selections[0])
      },
      share: {
        action: selected => confirm(<ShareModalConfirm t={ownProps.t} document={selected[0]} />),
        displayCondition: selections => selections.length === 1 && isFile(selections[0])
      }
    }
  })
})

const ShareModalConfirm = ({ abort, ...props }) => (
  <ShareModal onClose={abort} {...props} />
)

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView))
