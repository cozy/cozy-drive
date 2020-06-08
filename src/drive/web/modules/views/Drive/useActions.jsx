/* global __TARGET__ */
import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { models, useClient } from 'cozy-client'
import { SharingContext, ShareModal } from 'cozy-sharing'
import { ModalContext } from 'drive/lib/ModalContext'
import keyBy from 'lodash/keyBy'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import DeleteConfirm from 'drive/web/modules/drive/DeleteConfirm'
import MoveModal from 'drive/web/modules/move/MoveModal'
import { EditDocumentQualification } from 'cozy-scanner'
import ShareMenuItem from 'drive/web/modules/drive/ShareMenuItem'
import MakeAvailableOfflineMenuItem from 'drive/web/modules/drive/MakeAvailableOfflineMenuItem'

import { isMobileApp, isIOSApp, isIOS } from 'cozy-device-helper'
import { startRenamingAsync } from 'drive/web/modules/drive/rename'
import { isReferencedByAlbum } from 'drive/web/modules/drive/files' // TODO move to cozy-client models
import { forceFileDownload } from 'cozy-stack-client/dist/utils'
import {
  saveFileWithCordova,
  saveAndOpenWithCordova
} from 'drive/mobile/lib/filesystem'

const { file: fileModel } = models
const { isFile, isDirectory } = fileModel

const isAnyFileReferencedByAlbum = files => {
  for (let i = 0, l = files.length; i < l; ++i) {
    if (isReferencedByAlbum(files[i])) return true
  }
  return false
}

const isMissingFileError = error => error.status === 404

const downloadFileError = error => {
  return isMissingFileError(error)
    ? 'error.download_file.missing'
    : 'error.download_file.offline'
}

const openFileDownloadError = error => {
  return isMissingFileError(error)
    ? 'mobile.error.open_with.missing'
    : 'mobile.error.open_with.offline'
}

const downloadFiles = async (files, client) => {
  if (files.length === 1 && !isDirectory(files[0])) {
    const file = files[0]

    try {
      const downloadURL = await client
        .collection('io.cozy.files')
        .getDownloadLinkById(file.id)
      const filename = file.name

      forceFileDownload(
        `${client.getStackClient().uri}${downloadURL}?Dl=1`,
        filename
      )
    } catch (error) {
      Alerter.error(downloadFileError(error))
      throw error
    }
  } else {
    const ids = files.map(f => f.id)
    const href = await client
      .collection('io.cozy.files')
      .getArchiveLinkByIds(ids)
    const fullpath = `${client.getStackClient().uri}${href}`
    forceFileDownload(fullpath, 'files.zip')
  }
}

const isAlreadyInTrash = err => {
  const reasons = err.reason !== undefined ? err.reason.errors : undefined
  if (reasons) {
    for (const reason of reasons) {
      if (reason.detail === 'File or directory is already in the trash') {
        return true
      }
    }
  }
  return false
}

const trashFiles = async (files, client) => {
  try {
    for (const file of files) {
      await client.collection('io.cozy.files').destroy(file)
      client.collection('io.cozy.permissions').revokeSharingLink(file)
    }

    Alerter.success('alert.trash_file_success')
  } catch (err) {
    if (!isAlreadyInTrash(err)) {
      Alerter.error('alert.try_again')
    }
  }
}

export const exportFilesNative = async (files, client, filename) => {
  const downloadAllFiles = files.map(async file => {
    const response = await client
      .collection('io.cozy.files')
      .fetchFileContent(file)

    const blob = await response.blob()
    const filenameToUse = filename ? filename : file.name
    const localFile = await saveFileWithCordova(blob, filenameToUse)
    return localFile.nativeURL
  })

  try {
    Alerter.info('alert.preparing', {
      duration: Math.min(downloadAllFiles.length * 2000, 6000)
    })
    const urls = await Promise.all(downloadAllFiles)
    if (urls.length === 1 && isIOS()) {
      //TODO
      //It seems that files: is not well supported on iOS. url seems to work well
      //at with one file. Need to check when severals
      window.plugins.socialsharing.shareWithOptions(
        {
          url: urls[0]
        },
        result => {
          if (result.completed === true) {
            Alerter.success('mobile.download.success')
          }
        },
        error => {
          throw error
        }
      )
    } else {
      window.plugins.socialsharing.shareWithOptions(
        {
          files: urls
        },
        null,
        error => {
          throw error
        }
      )
    }
  } catch (error) {
    Alerter.error(downloadFileError(error))
  }
}

export const openFileWith = async (file, client, filename) => {
  if (isMobileApp() && window.cordova.plugins.fileOpener2) {
    let fileData
    try {
      fileData = await client.collection('io.cozy.files').fetchFileContent(file)
    } catch (error) {
      Alerter.error(openFileDownloadError(error))
      throw error
    }

    const blob = await fileData.blob()
    try {
      await saveAndOpenWithCordova(blob, filename)
    } catch (error) {
      Alerter.error('mobile.error.open_with.noapp')
    }
  } else {
    Alerter.error('mobile.error.open_with.noapp')
  }
}

const useActions = (documentId, { canMove } = {}) => {
  const { pushModal, popModal } = useContext(ModalContext)
  const { hasWriteAccess, refresh } = useContext(SharingContext)
  const client = useClient()
  const dispatch = useDispatch()

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
            action: files => exportFilesNative(files, client)
          }
        : {
            icon: 'download',
            action: files => downloadFiles(files, client)
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
              trashFiles(files, client) // TODO faire le trash a proprement parler dans la modale de confirmation
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
      action: files => openFileWith(files[0], client, files[0].name)
    },
    rename: {
      icon: 'rename',
      displayCondition: selection => isWritable && selection.length === 1,
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
      action: () => {
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
