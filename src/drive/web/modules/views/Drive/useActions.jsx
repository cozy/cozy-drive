/* global __TARGET__ */
import React, { useContext } from 'react'
import { SharingContext, ShareModal } from 'cozy-sharing'
import { ModalContext } from 'drive/lib/ModalContext'
import keyBy from 'lodash/keyBy'

import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MoveModal from 'drive/web/modules/move/MoveModal'
import { EditDocumentQualification } from 'cozy-scanner'
import ShareMenuItem from 'drive/web/modules/drive/ShareMenuItem'
import MakeAvailableOfflineMenuItem from 'drive/web/modules/drive/MakeAvailableOfflineMenuItem'

import { isIOSApp } from 'cozy-device-helper'
import { isFile, isReferencedByAlbum } from 'drive/web/modules/drive/files' //TODO use cozy-client models
import { trashFiles } from 'drive/web/modules/navigation/duck'

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

const useActions = (documentId, { canMove } = {}) => {
  const { pushModal, popModal } = useContext(ModalContext)
  const { hasWriteAccess, refresh } = useContext(SharingContext)

  const isWritable = hasWriteAccess(documentId)

  const actions = {
    share: {
      icon: 'share',
      displayCondition: selection => isWritable && selection.length === 1,
      action: selected =>
        pushModal(
          <ShareModal
            document={selected[0]}
            documentType="Files"
            sharingDesc={selected[0].name}
            onClose={popModal}
          />
        ),
      Component: function ShareMenuItemInMenu({ files, ...rest }) {
        return <ShareMenuItem docId={files[0].id} {...rest} />
      }
    },
    download:
      __TARGET__ === 'mobile'
        ? {
            icon: 'download',
            displayCondition: files => {
              if (isIOSApp()) return files.length === 1 && isFile(files[0])
              return files.reduce(
                (onlyFiles, file) => onlyFiles && isFile(file),
                true
              )
            },
            action: files => alert('not implemented') //dispatch(exportFilesNative(files)),
          }
        : {
            icon: 'download',
            action: files => alert('not implemented') //dispatch(downloadFiles(files))
          },
    trash: {
      icon: 'trash',
      displayCondition: () => isWritable,
      action: files =>
        pushModal(
          <DeleteConfirm
            files={files}
            referenced={isAnyFileReferencedByAlbum(files)}
            onConfirm={() => {
              refresh()
              // trashFiles(files) // client.collection.delete() + Cordova delete) -> transformer en afterDelete
            }}
            onClose={popModal}
          />
        )
    },
    open: {
      icon: 'openWith',
      displayCondition: selection =>
        __TARGET__ === 'mobile' &&
        selection.length === 1 &&
        isFile(selection[0]),
      action: files => alert('not implemented') //dispatch(openFileWith(files[0].id, files[0].name)),
    },
    rename: {
      icon: 'rename',
      displayCondition: selection => isWritable && selection.length === 1,
      action: files => alert('not implemented') //dispatch(startRenamingAsync(files[0])),
    },
    move: {
      icon: 'moveto',
      displayCondition: () => canMove,
      action: files =>
        pushModal(<MoveModal entries={files} onClose={popModal} />)
    },
    qualify: {
      icon: 'qualify',
      displayCondition: selection =>
        selection.length === 1 && isFile(selection[0]),
      action: files =>
        pushModal(
          <EditDocumentQualification
            document={files[0]}
            onQualified={file => {
              //dispatch(updateFile(extractFileAttributes(file)))
            }}
            onClose={popModal}
          />
        )
    },
    versions: {
      icon: 'history',
      displayCondition: selection =>
        selection.length === 1 && isFile(selection[0]),
      action: files => {
        alert('not implemented')
        // trackEvent()
        // return ownProps.router.push(
        //   `${ownProps.location.pathname}/file/${files[0].id}/revision`
        // )
      }
    },
    offline: {
      icon: 'phone-download',
      displayCondition: selections =>
        __TARGET__ === 'mobile' &&
        selections.length === 1 &&
        isFile(selections[0]),
      Component: function MakeAvailableOfflineMenuItemInMenu({
        files,
        ...rest
      }) {
        return <MakeAvailableOfflineMenuItem file={files[0]} {...rest} />
      }
    }
  }

  return keyBy(Object.values(actions), 'icon')
}

export default useActions
