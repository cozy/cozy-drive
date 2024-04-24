import { useDisplayedFolder } from 'hooks'
import { CozyFile } from 'models'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { cancelable, Q, useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { useBreakpoints } from 'cozy-ui/transpiled/react'
import Button from 'cozy-ui/transpiled/react/Buttons'
import { FixedDialog } from 'cozy-ui/transpiled/react/CozyDialogs'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { withStyles } from 'cozy-ui/transpiled/react/styles'

import { ROOT_DIR_ID } from 'constants/config'
import logger from 'lib/logger'
import Footer from 'modules/move/Footer'
import Header from 'modules/move/Header'
import { MoveInsideSharedFolderModal } from 'modules/move/MoveInsideSharedFolderModal'
import { MoveModalContent } from 'modules/move/MoveModalContent'
import { MoveOutsideSharedFolderModal } from 'modules/move/MoveOutsideSharedFolderModal'
import { MoveSharedFolderInsideAnotherModal } from 'modules/move/MoveSharedFolderInsideAnotherModal'
import Topbar from 'modules/move/Topbar'
import { cancelMove, hasOneOfEntriesShared } from 'modules/move/helpers'

const styles = () => ({
  paper: {
    height: '100%',
    '& .MuiDialogContent-root': {
      padding: '0'
    },
    '& .MuiDialogTitle-root': {
      padding: '0'
    }
  }
})

/**
 * Modal to move a folder to an other
 */
const MoveModal = ({ onClose, entries, classes }) => {
  const { t } = useI18n()
  const client = useClient()
  const { isMobile } = useBreakpoints()
  const { displayedFolder } = useDisplayedFolder()
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

  const [folderId, setFolderId] = useState(
    displayedFolder ? displayedFolder._id : ROOT_DIR_ID
  )
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
  const [isFolderCreationDisplayed, setFolderCreationDisplayed] =
    useState(false)

  useEffect(() => {
    // unregister cancelables when component will unmount
    return () => {
      promises.forEach(p => p.cancel())
      setPromises([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigateTo = folder => {
    setFolderId(folder._id)
    setFolderCreationDisplayed(false)
  }

  const registerCancelable = promise => {
    if (!promises) setPromises([])
    const cancelableP = cancelable(promise)
    setPromises([...promises, cancelableP])
    return cancelableP
  }

  const handleConfirmation = async () => {
    const sharedParentPath = getSharedParentPath(entries[0].path)
    const targetPath = await CozyFile.getFullpath(folderId, entries[0].name)

    const areMovedFilesShared = hasOneOfEntriesShared(entries, byDocId)
    const isOriginParentShared = hasSharedParent(entries[0].path)
    const isTargetShared = hasSharedParent(targetPath)
    const isInsideSameSharedFolder = targetPath.startsWith(sharedParentPath)

    if (isInsideSameSharedFolder) {
      moveEntries()
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

    moveEntries()
  }

  const moveEntries = async () => {
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
    moveEntries()
  }

  const handleCancelMovingInside = () => {
    setMovingInsideSharedFolder(false)
  }

  const handleConfirmMovingInside = () => {
    setMovingInsideSharedFolder(false)
    moveEntries()
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
    moveEntries()
    setMovingSharedFolderInsideAnother(false)
  }

  const showFolderCreation = () => {
    setFolderCreationDisplayed(true)
  }

  const hideFolderCreation = () => {
    setFolderCreationDisplayed(false)
  }

  return (
    <>
      <FixedDialog
        open
        onClose={isMobile ? undefined : onClose}
        size="large"
        classes={{
          paper: classes.paper
        }}
        title={
          <>
            <Header entries={entries} />
            <Topbar
              navigateTo={navigateTo}
              folderId={folderId}
              showFolderCreation={showFolderCreation}
            />
          </>
        }
        content={
          <MoveModalContent
            folderId={folderId}
            navigateTo={navigateTo}
            entries={entries}
            isFolderCreationDisplayed={isFolderCreationDisplayed}
            hideFolderCreation={hideFolderCreation}
          />
        }
        actions={
          <Footer
            onConfirm={handleConfirmation}
            onClose={onClose}
            targets={entries}
            currentDirId={folderId}
            isMoving={isMoveInProgress}
            isLoading={!allLoaded}
          />
        }
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
          folderId={folderId}
          onCancel={() => setMovingSharedFolderInsideAnother(false)}
          onConfirm={handleMovingSharedFolderInsideAnother}
        />
      ) : null}
      {isMovingInsideSharedFolder ? (
        <MoveInsideSharedFolderModal
          onCancel={handleCancelMovingInside}
          onConfirm={handleConfirmMovingInside}
          entries={entries}
          folderId={folderId}
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

export default withStyles(styles)(MoveModal)
