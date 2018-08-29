/* global __TARGET__ */
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { showModal } from 'react-cozy-helpers'
import { SharedDocument, SharedRecipients, ShareModal } from 'sharing'

import FolderView from 'drive/web/modules/layout/FolderView'
import DeleteConfirm from './DeleteConfirm'
import Toolbar from './Toolbar'
import { isRenaming, getRenamingFile, startRenamingAsync } from './rename'
import { isFile, isReferencedByAlbum } from './files'
import { isAvailableOffline } from './availableOffline'
import MenuItem, {
  ConnectedToggleMenuItem
} from 'drive/web/modules/actionmenu/MenuItem'

import {
  createFolder,
  openFileWith,
  downloadFiles,
  exportFilesNative,
  trashFiles,
  toggleAvailableOffline
} from 'drive/web/modules/navigation/duck'

import styles from 'drive/styles/actionmenu'

const ShareMenuItem = ({ docId, ...rest }, { t }) => (
  <SharedDocument docId={docId}>
    {({ isSharedWithMe }) => (
      <MenuItem {...rest}>
        {isSharedWithMe ? t('Files.share.sharedWithMe') : t('Files.share.cta')}
        <SharedRecipients
          className={styles['fil-actionmenu-recipients']}
          docId={docId}
          size="small"
        />
      </MenuItem>
    )}
  </SharedDocument>
)

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

const mapStateToProps = (state, ownProps) => ({
  isRenaming: isRenaming(state),
  renamingFile: getRenamingFile(state),
  Toolbar,
  isAvailableOffline: isAvailableOffline(state)
})

const mapDispatchToProps = (dispatch, ownProps) => {
  const { hasWriteAccess } = ownProps
  return {
    actions: Object.assign({}, ownProps.actions, {
      list: {
        createFolder: name => dispatch(createFolder(name))
      },
      selection: {
        share: {
          action: selected =>
            dispatch(
              showModal(
                <ShareModal
                  document={selected[0]}
                  documentType="Files"
                  sharingDesc={selected[0].name}
                />
              )
            ),
          displayCondition: selections =>
            hasWriteAccess && selections.length === 1,
          Component: ({ files, ...rest }) => (
            <ShareMenuItem docId={files[0].id} {...rest} />
          )
        },
        download:
          __TARGET__ === 'mobile'
            ? {
                action: files => dispatch(exportFilesNative(files)),
                displayCondition: files =>
                  files.reduce(
                    (onlyFiles, file) => onlyFiles && isFile(file),
                    true
                  )
              }
            : {
                action: files => dispatch(downloadFiles(files))
              },
        trash: {
          action: files =>
            dispatch(
              showModal(
                <DeleteConfirm
                  files={files}
                  referenced={isAnyFileReferencedByAlbum(files)}
                  onConfirm={() => dispatch(trashFiles(files))}
                />
              )
            ),
          displayCondition: selections => hasWriteAccess
        },
        openWith: {
          action: files => dispatch(openFileWith(files[0].id, files[0].name)),
          displayCondition: selections =>
            __TARGET__ === 'mobile' &&
            selections.length === 1 &&
            isFile(selections[0])
        },
        rename: {
          action: selected => dispatch(startRenamingAsync(selected[0])),
          displayCondition: selections =>
            hasWriteAccess && selections.length === 1
        },
        'phone-download': {
          action: selected => dispatch(toggleAvailableOffline(selected[0])),
          displayCondition: selections =>
            __TARGET__ === 'mobile' &&
            selections.length === 1 &&
            isFile(selections[0]),
          Component: props => <ConnectedToggleMenuItem {...props} />
        }
      }
    })
  }
}

const ConnectedFolderView = translate()(
  connect(mapStateToProps, mapDispatchToProps)(FolderView)
)

const FolderViewWithSharingContext = props =>
  // props.displayedFolder is null on the recent file view for example
  !props.displayedFolder ? (
    <ConnectedFolderView {...props} hasWriteAccess={false} />
  ) : (
    <SharedDocument docId={props.displayedFolder.id}>
      {({ hasWriteAccess }) => (
        <ConnectedFolderView {...props} hasWriteAccess={hasWriteAccess} />
      )}
    </SharedDocument>
  )

export default FolderViewWithSharingContext
