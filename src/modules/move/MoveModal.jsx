import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { move } from 'cozy-client/dist/models/file'
import { useSharingContext } from 'cozy-sharing'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPicker } from 'components/FolderPicker/FolderPicker'
import logger from 'lib/logger'
import { joinPath, getParentPath } from 'lib/path'
import { MoveInsideSharedFolderModal } from 'modules/move/MoveInsideSharedFolderModal'
import { MoveOutsideSharedFolderModal } from 'modules/move/MoveOutsideSharedFolderModal'
import { MoveSharedFolderInsideAnotherModal } from 'modules/move/MoveSharedFolderInsideAnotherModal'
import { cancelMove, hasOneOfEntriesShared } from 'modules/move/helpers'
import { useCancelable } from 'modules/move/hooks/useCancelable'
import { computeNextcloudFolderQueryId } from 'modules/nextcloud/queries'

/**
 * Modal to move a folder to an other
 */
const MoveModal = ({
  onClose,
  currentFolder,
  entries,
  showNextcloudFolder
}) => {
  const { t } = useI18n()
  const client = useClient()
  const {
    sharedPaths,
    refresh: refreshSharing,
    getSharedParentPath,
    hasSharedParent,
    isOwner,
    revokeSelf,
    revokeAllRecipients,
    byDocId,
    allLoaded
  } = useSharingContext()
  const navigate = useNavigate()
  const { showAlert } = useAlert()
  const { registerCancelable } = useCancelable()

  const [folderSelected, setFolderSelected] = useState(null)

  const [isMoveInProgress, setMoveInProgress] = useState(false)
  const [isMovingOutsideSharedFolder, setMovingOutsideSharedFolder] =
    useState(false)
  const [
    isMovingSharedFolderInsideAnother,
    setMovingSharedFolderInsideAnother
  ] = useState(false)
  const [isMovingInsideSharedFolder, setMovingInsideSharedFolder] =
    useState(false)

  const handleConfirm = async folder => {
    setFolderSelected(folder)

    const sharedParentPath = getSharedParentPath(entries[0].path)
    const targetPath = joinPath(folder.path, entries[0].name)

    const areMovedFilesShared = hasOneOfEntriesShared(entries, byDocId)
    const isOriginParentShared = hasSharedParent(entries[0].path)
    const isTargetShared = hasSharedParent(targetPath)
    const isInsideSameSharedFolder = targetPath.startsWith(sharedParentPath)

    if (isInsideSameSharedFolder) {
      moveEntries(folder)
      return
    }

    if (isOriginParentShared && !isTargetShared) {
      setMovingOutsideSharedFolder(true)
      return
    }

    if (!areMovedFilesShared && isTargetShared) {
      setMovingInsideSharedFolder(true)
      return
    }

    if (areMovedFilesShared && isTargetShared) {
      setMovingSharedFolderInsideAnother(true)
      return
    }

    moveEntries(folder)
  }

  const moveEntries = async folder => {
    try {
      setMoveInProgress(true)
      const trashedFiles = []
      await Promise.all(
        entries.map(async entry => {
          const force = !sharedPaths.includes(folder.path)
          const moveResponse = await registerCancelable(
            move(client, entry, folder, {
              force
            })
          )
          if (moveResponse.deleted) {
            trashedFiles.push(moveResponse.deleted)
          }
        })
      )

      const isMovingInsideNextcloud =
        folder._type === 'io.cozy.remote.nextcloud.files'
      if (isMovingInsideNextcloud) {
        client.resetQuery(
          computeNextcloudFolderQueryId({
            sourceAccount: folder.cozyMetadata.sourceAccount,
            path: folder.path
          })
        )
      }

      const isMovingOutsideNextcloud =
        !isMovingInsideNextcloud &&
        entries[0]._type === 'io.cozy.remote.nextcloud.files'
      if (isMovingOutsideNextcloud) {
        client.resetQuery(
          computeNextcloudFolderQueryId({
            sourceAccount: entries[0].cozyMetadata.sourceAccount,
            path: getParentPath(entries[0].path)
          })
        )
      }

      const targetName = folder.name || t('breadcrumb.title_drive')

      const targetRoute =
        folder._type === 'io.cozy.remote.nextcloud.files'
          ? `/folder/${folder.id}`
          : `/nextcloud/${folder.id}`

      showAlert({
        action: (
          <>
            {!isMovingInsideNextcloud && !isMovingOutsideNextcloud ? (
              <Button
                color="success"
                label={t('Move.cancel')}
                onClick={() =>
                  cancelMove({
                    entries,
                    trashedFiles,
                    client,
                    registerCancelable,
                    refreshSharing
                  })
                }
                size="small"
                variant="text"
              />
            ) : null}
            <Button
              color="success"
              label={t('Move.go_to_dir')}
              onClick={() => navigate(targetRoute)}
              size="small"
              variant="text"
            />
          </>
        ),
        message: t('Move.success', {
          smart_count: entries.length,
          subject: entries.length === 1 ? entries[0].name : '',
          target: targetName
        }),
        severity: 'success'
      })
      if (refreshSharing) refreshSharing()
    } catch (e) {
      logger.warn(e)
      Alerter.error('Move.error', { smart_count: entries.length })
    } finally {
      setMoveInProgress(false)
      onClose()
    }
  }

  const handleCancelMovingOutside = () => {
    setMovingOutsideSharedFolder(false)
  }

  const handleConfirmMovingOutside = () => {
    setMovingOutsideSharedFolder(false)
    moveEntries(folderSelected)
  }

  const handleCancelMovingInside = () => {
    setMovingInsideSharedFolder(false)
  }

  const handleConfirmMovingInside = () => {
    setMovingInsideSharedFolder(false)
    moveEntries(folderSelected)
  }

  const handleMovingSharedFolderInsideAnother = async () => {
    setMoveInProgress(true)
    entries.forEach(async entry => {
      if (byDocId[entry._id] !== undefined) {
        if (isOwner(entry._id)) {
          await revokeAllRecipients(entry)
        } else {
          await revokeSelf(entry)
        }
      }
    })
    refreshSharing()
    moveEntries(folderSelected)
    setMovingSharedFolderInsideAnother(false)
  }

  return (
    <>
      <FolderPicker
        showNextcloudFolder={showNextcloudFolder}
        currentFolder={currentFolder}
        entries={entries}
        onConfirm={handleConfirm}
        onClose={onClose}
        isBusy={isMoveInProgress || !allLoaded}
      />
      {isMovingOutsideSharedFolder ? (
        <MoveOutsideSharedFolderModal
          entries={entries}
          onCancel={handleCancelMovingOutside}
          onConfirm={handleConfirmMovingOutside}
        />
      ) : null}
      {isMovingSharedFolderInsideAnother ? (
        <MoveSharedFolderInsideAnotherModal
          entries={entries}
          folderId={folderSelected._id}
          onCancel={() => setMovingSharedFolderInsideAnother(false)}
          onConfirm={handleMovingSharedFolderInsideAnother}
        />
      ) : null}
      {isMovingInsideSharedFolder ? (
        <MoveInsideSharedFolderModal
          onCancel={handleCancelMovingInside}
          onConfirm={handleConfirmMovingInside}
          entries={entries}
          folderId={folderSelected._id}
        />
      ) : null}
    </>
  )
}

MoveModal.propTypes = {
  /** List of files or folder to move */
  entries: PropTypes.array
}

export { MoveModal }

export default MoveModal
