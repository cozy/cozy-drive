/* global __TARGET__ */
import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import { showModal } from 'react-cozy-helpers'
import { SharedDocument, ShareModal } from 'cozy-sharing'

import FolderView from 'drive/web/modules/layout/FolderView'
import DeleteConfirm from './DeleteConfirm'
import Toolbar from './Toolbar'
import { isRenaming, getRenamingFile, startRenamingAsync } from './rename'
import { isFile, isReferencedByAlbum } from './files'
import MoveModal from 'drive/web/modules/move/MoveModal'
import { EditDocumentQualification } from 'cozy-scanner'
import {
  openFileWith,
  downloadFiles,
  exportFilesNative,
  trashFiles,
  updateFile
} from 'drive/web/modules/navigation/duck'
import { extractFileAttributes } from 'drive/web/modules/navigation/duck/async'
import { isIOSApp } from 'cozy-device-helper'

import ShareMenuItem from 'drive/web/modules/drive/ShareMenuItem'
import MakeAvailableOfflineMenuItem from 'drive/web/modules/drive/MakeAvailableOfflineMenuItem'

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

const trackEvent = () => {
  const tracker = getTracker()
  if (tracker) {
    tracker.push(['trackEvent', 'Drive', 'Versioning', 'ClickFromMenuFile'])
  }
}

const mapStateToProps = state => ({
  isRenaming: isRenaming(state),
  renamingFile: getRenamingFile(state),
  Toolbar
})

const mapDispatchToProps = (dispatch, ownProps) => {
  const { hasWriteAccess, canMove, onFileDelete } = ownProps
  return {
    actions: Object.assign({}, ownProps.actions, {
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
          //eslint-disable-next-line
          Component: ({ files, ...rest }) => (
            <ShareMenuItem docId={files[0].id} {...rest} />
          )
        },
        download:
          __TARGET__ === 'mobile'
            ? {
                action: files => dispatch(exportFilesNative(files)),
                displayCondition: files => {
                  if (isIOSApp()) return files.length === 1 && isFile(files[0])
                  return files.reduce(
                    (onlyFiles, file) => onlyFiles && isFile(file),
                    true
                  )
                }
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
                  onConfirm={() => {
                    onFileDelete()
                    return dispatch(trashFiles(files))
                  }}
                />
              )
            ),
          displayCondition: () => hasWriteAccess
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
        moveto: {
          action: selected =>
            dispatch(showModal(<MoveModal entries={selected} />)),
          displayCondition: () => hasWriteAccess && canMove
        },
        qualify: {
          action: selected =>
            dispatch(
              showModal(
                <EditDocumentQualification
                  document={selected[0]}
                  onQualified={file => {
                    dispatch(updateFile(extractFileAttributes(file)))
                  }}
                />
              )
            ),
          displayCondition: selections =>
            hasWriteAccess && selections.length === 1 && isFile(selections[0])
        },
        history: {
          action: selected => {
            trackEvent()
            return ownProps.router.push(
              `${ownProps.location.pathname}/file/${selected[0].id}/revision`
            )
          },
          displayCondition: selections =>
            selections.length === 1 && isFile(selections[0])
        },
        'phone-download': {
          displayCondition: selections =>
            __TARGET__ === 'mobile' &&
            selections.length === 1 &&
            isFile(selections[0]),
          //eslint-disable-next-line
          Component: ({ files, ...rest }) => (
            <MakeAvailableOfflineMenuItem file={files[0]} {...rest} />
          )
        }
      }
    })
  }
}

const ConnectedFolderView = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(FolderView)
)

const FolderViewWithSharingContext = props =>
  // props.displayedFolder is null on the recent file view for example
  !props.displayedFolder ? (
    <ConnectedFolderView {...props} hasWriteAccess={false} />
  ) : (
    <SharedDocument docId={props.displayedFolder.id}>
      {({ hasWriteAccess, onFileDelete }) => (
        <ConnectedFolderView
          {...props}
          hasWriteAccess={hasWriteAccess}
          onFileDelete={onFileDelete}
        />
      )}
    </SharedDocument>
  )

export default FolderViewWithSharingContext
