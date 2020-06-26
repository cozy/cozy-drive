/* global __TARGET__ */
import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { models, useClient } from 'cozy-client'
import { SharingContext, ShareModal } from 'cozy-sharing'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import { ModalContext } from 'drive/lib/ModalContext'
import { useRouter } from 'drive/lib/RouterContext'
import keyBy from 'lodash/keyBy'

import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MoveModal from 'drive/web/modules/move/MoveModal'
import { EditDocumentQualification } from 'cozy-scanner'
import ShareMenuItem from 'drive/web/modules/drive/ShareMenuItem'
import MakeAvailableOfflineMenuItem from 'drive/web/modules/drive/MakeAvailableOfflineMenuItem'

import { isIOSApp } from 'cozy-device-helper'
import { startRenamingAsync } from 'drive/web/modules/drive/rename'

const { file: fileModel } = models
const { isFile } = fileModel

import {
  isAnyFileReferencedByAlbum,
  exportFilesNative,
  downloadFiles,
  trashFiles,
  openFileWith
} from './utils'

const useActions = ({ hasWriteAccess, canMove } = {}) => {
  const { pushModal, popModal } = useContext(ModalContext)
  const { refresh } = useContext(SharingContext)
  const { router, location } = useRouter()
  const client = useClient()
  const dispatch = useDispatch()

  const actions = {
    share: {
      icon: 'share',
      displayCondition: selection => hasWriteAccess && selection.length === 1,
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
            action: files => exportFilesNative(client, files)
          }
        : {
            icon: 'download',
            action: files => downloadFiles(client, files)
          },
    trash: {
      icon: 'trash',
      displayCondition: () => hasWriteAccess,
      action: files =>
        pushModal(
          <DeleteConfirm
            files={files}
            referenced={isAnyFileReferencedByAlbum(files)}
            onConfirm={() => {
              refresh()
              trashFiles(client, files) // TODO faire le trash a proprement parler dans la modale de confirmation
              // TODO supprimer les fichiers de la sélection
              popModal()
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
      action: files => openFileWith(client, files[0])
    },
    rename: {
      icon: 'rename',
      displayCondition: selection => hasWriteAccess && selection.length === 1,
      action: files => dispatch(startRenamingAsync(files[0]))
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
            onQualified={() => {
              popModal()
              // changes should be retrieved through cozy-client
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
        const tracker = getTracker()
        if (tracker) {
          tracker.push([
            'trackEvent',
            'Drive',
            'Versioning',
            'ClickFromMenuFile'
          ])
        }
        return router.push(`${location.pathname}/file/${files[0].id}/revision`)
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
