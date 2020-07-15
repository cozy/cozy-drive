/* global __TARGET__ */
import React from 'react'
import { models } from 'cozy-client'
import { ShareModal } from 'cozy-sharing'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'

import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MoveModal from 'drive/web/modules/move/MoveModal'
import { EditDocumentQualification } from 'cozy-scanner'
import ShareMenuItem from 'drive/web/modules/drive/ShareMenuItem'
import MakeAvailableOfflineMenuItem from 'drive/web/modules/drive/MakeAvailableOfflineMenuItem'
import DestroyConfirm from 'drive/web/modules/trash/components/DestroyConfirm'

import { isIOSApp } from 'cozy-device-helper'
import { startRenamingAsync } from 'drive/web/modules/drive/rename'

const { file: fileModel } = models
const { isFile } = fileModel

import {
  isAnyFileReferencedByAlbum,
  exportFilesNative,
  downloadFiles,
  openFileWith,
  restoreFiles
} from './utils'

export const share = ({ hasWriteAccess, pushModal, popModal }) => {
  return {
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
  }
}

export const download = ({ client }) => {
  return __TARGET__ === 'mobile'
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
      }
}

export const trash = ({
  pushModal,
  popModal,
  hasWriteAccess,
  refresh,
  refreshFolderContent
}) => {
  return {
    icon: 'trash',
    displayCondition: () => hasWriteAccess,
    action: files =>
      pushModal(
        <DeleteConfirm
          files={files}
          referenced={isAnyFileReferencedByAlbum(files)}
          afterConfirmation={() => {
            refresh()
            if (refreshFolderContent) refreshFolderContent()
          }}
          onClose={popModal}
        />
      )
  }
}

export const open = ({ client }) => {
  return {
    icon: 'openWith',
    displayCondition: selection =>
      __TARGET__ === 'mobile' && selection.length === 1 && isFile(selection[0]),
    action: files => openFileWith(client, files[0])
  }
}

export const rename = ({ hasWriteAccess, dispatch }) => {
  return {
    icon: 'rename',
    displayCondition: selection => hasWriteAccess && selection.length === 1,
    action: files => dispatch(startRenamingAsync(files[0]))
  }
}

export const move = ({ canMove, pushModal, popModal }) => {
  return {
    icon: 'moveto',
    displayCondition: () => canMove,
    action: files => pushModal(<MoveModal entries={files} onClose={popModal} />)
  }
}

export const qualify = ({ pushModal, popModal }) => {
  return {
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
  }
}

export const versions = ({ router, location }) => {
  return {
    icon: 'history',
    displayCondition: selection =>
      selection.length === 1 && isFile(selection[0]),
    action: files => {
      const tracker = getTracker()
      if (tracker) {
        tracker.push(['trackEvent', 'Drive', 'Versioning', 'ClickFromMenuFile'])
      }
      return router.push(`${location.pathname}/file/${files[0].id}/revision`)
    }
  }
}

export const offline = () => {
  return {
    icon: 'phone-download',
    displayCondition: selections =>
      __TARGET__ === 'mobile' &&
      selections.length === 1 &&
      isFile(selections[0]),
    Component: function MakeAvailableOfflineMenuItemInMenu({ files, ...rest }) {
      return <MakeAvailableOfflineMenuItem file={files[0]} {...rest} />
    }
  }
}

export const restore = ({ refresh, client }) => {
  return {
    icon: 'restore',
    action: async files => {
      await restoreFiles(client, files)
      refresh()
    }
  }
}

export const destroy = ({ pushModal, popModal }) => {
  return {
    icon: 'destroy',
    action: files =>
      pushModal(<DestroyConfirm files={files} onClose={popModal} />)
  }
}
