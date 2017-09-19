/* global __TARGET__ */
import React from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { translate } from 'cozy-ui/react/I18n'
import confirm from '../../lib/confirm'

import FolderView from '../../components/FolderView'
import DeleteConfirm from '../../components/DeleteConfirm'
import { ShareModal } from 'sharing'
import Toolbar from './Toolbar'
import { isRenaming, getRenamingFile, startRenamingAsync } from './rename'
import { isFile, isReferencedByAlbum } from './files'
import { isAvailableOffline } from './availableOffline'
import { ConnectedToggleMenuItem } from '../../components/FileActionMenu'

import {
  createFolder,
  abortAddFolder,
  openFileWith,
  downloadFiles,
  trashFiles,
  toggleAvailableOffline
} from '../../actions'

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

const mapStateToProps = (state, ownProps) => ({
  isTrashContext: ownProps.isTrashContext,
  canUpload: ownProps.canUpload,
  canCreateFolder: ownProps.canCreateFolder,
  isRenaming: isRenaming(state),
  renamingFile: getRenamingFile(state),
  Toolbar,
  isAvailableOffline: isAvailableOffline(state)
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
        action: files => dispatch(downloadFiles(files))
      },
      trash: {
        action: files => confirm(<DeleteConfirm t={ownProps.t} fileCount={files.length} referenced={isAnyFileReferencedByAlbum(files)} />)
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
      availableOffline: {
        action: selected => dispatch(toggleAvailableOffline(selected[0])),
        displayCondition: (selections) => __TARGET__ === 'mobile' && selections.length === 1 && isFile(selections[0]),
        Component: (props) => <ConnectedToggleMenuItem {...props} />
      },
      share: {
        action: selected => dispatch(showModal(<ShareModal document={selected[0]} documentType='Files' sharingDesc={selected[0].name} />)),
        displayCondition: selections => selections.length === 1 && isFile(selections[0])
      }
    }
  })
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(FolderView))
