import { CozyFile } from 'models'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { cancelable, Q, useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPicker } from 'components/FolderPicker/FolderPicker'
import logger from 'lib/logger'
import { MoveInsideSharedFolderModal } from 'modules/move/MoveInsideSharedFolderModal'
import { MoveOutsideSharedFolderModal } from 'modules/move/MoveOutsideSharedFolderModal'
import { MoveSharedFolderInsideAnotherModal } from 'modules/move/MoveSharedFolderInsideAnotherModal'
import { cancelMove, hasOneOfEntriesShared } from 'modules/move/helpers'

/**
 * Modal to move a folder to an other
 */
const MoveModal = ({ onClose, entries }) => {
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

  const [selectedFolderId, setSelectedFolderId] = useState(null)

  const [isMoveInProgress, setMoveInProgress] = useState(false)
  const [promises, setPromises] = useState([])
  const [isMovingOutsideSharedFolder, setMovingOutsideSharedFolder] =
    useState(false)
  const [
    isMovingSharedFolderInsideAnother,
    setMovingSharedFolderInsideAnother
  ] = useState(false)
  const [isMovingInsideSharedFolder, setMovingInsideSharedFolder] =
    useState(false)

  useEffect(() => {
    // unregister cancelables when component will unmount
    return () => {
      promises.forEach(p => p.cancel())
      setPromises([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const registerCancelable = promise => {
    if (!promises) setPromises([])
    const cancelableP = cancelable(promise)
    setPromises([...promises, cancelableP])
    return cancelableP
  }

  const handleConfirmation = async folderId => {
    setSelectedFolderId(folderId)
    const sharedParentPath = getSharedParentPath(entries[0].path)
    const targetPath = await CozyFile.getFullpath(folderId, entries[0].name)

    const areMovedFilesShared = hasOneOfEntriesShared(entries, byDocId)
    const isOriginParentShared = hasSharedParent(entries[0].path)
    const isTargetShared = hasSharedParent(targetPath)
    const isInsideSameSharedFolder = targetPath.startsWith(sharedParentPath)

    if (isInsideSameSharedFolder) {
      moveEntries(folderId)
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

    moveEntries(folderId)
  }

  const moveEntries = async folderId => {
    try {
      setMoveInProgress(true)
      const trashedFiles = []
      await Promise.all(
        entries.map(async entry => {
          const targetPath = await registerCancelable(
            CozyFile.getFullpath(folderId, entry.name)
          )
          const force = !sharedPaths.includes(targetPath)
          const moveResponse = await registerCancelable(
            CozyFile.move(entry._id, { folderId }, force)
          )
          if (moveResponse.deleted) {
            trashedFiles.push(moveResponse.deleted)
          }
        })
      )

      const response = await registerCancelable(
        client.query(Q('io.cozy.files').getById(folderId))
      )
      const targetName = response.data?.name || t('breadcrumb.title_drive')
      const targetDir = response.data?.id

      showAlert({
        action: (
          <>
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

            <Button
              color="success"
              label={t('Move.go_to_dir')}
              onClick={() => navigate(`/folder/${targetDir}`)}
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
      onClose({
        cancelSelection: true
      })
    }
  }

  const handleCancelMovingOutside = () => {
    setMovingOutsideSharedFolder(false)
  }

  const handleConfirmMovingOutside = () => {
    setMovingOutsideSharedFolder(false)
    moveEntries(selectedFolderId)
  }

  const handleCancelMovingInside = () => {
    setMovingInsideSharedFolder(false)
  }

  const handleConfirmMovingInside = () => {
    setMovingInsideSharedFolder(false)
    moveEntries(selectedFolderId)
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
    moveEntries(selectedFolderId)
    setMovingSharedFolderInsideAnother(false)
  }

  return (
    <>
      <FolderPicker
        entries={entries}
        onConfirm={handleConfirmation}
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
          folderId={selectedFolderId}
          onCancel={() => setMovingSharedFolderInsideAnother(false)}
          onConfirm={handleMovingSharedFolderInsideAnother}
        />
      ) : null}
      {isMovingInsideSharedFolder ? (
        <MoveInsideSharedFolderModal
          onCancel={handleCancelMovingInside}
          onConfirm={handleConfirmMovingInside}
          entries={entries}
          folderId={selectedFolderId}
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
