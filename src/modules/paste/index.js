import { isFile, copy, move } from 'cozy-client/dist/models/file'

import { resolveNameConflictsForCut } from './utils'

import { ROOT_DIR_ID, NEXTCLOUD_FILE_ID } from '@/constants/config'
import { DOCTYPE_FILES } from '@/lib/doctypes'
import logger from '@/lib/logger'
import { joinPath } from '@/lib/path'
import { hasOneOfEntriesShared } from '@/modules/move/helpers'
import { computeNextcloudFolderQueryId } from '@/modules/nextcloud/helpers'

export const handlePasteOperation = async (
  client,
  files,
  operation,
  targetFolder,
  options = {}
) => {
  const { showAlert, t, sharingContext, isPublic } = options
  const results = []

  // For cut operations, resolve name conflicts first
  let processedFiles = files
  if (operation === 'cut') {
    processedFiles = await resolveNameConflictsForCut(
      client,
      files,
      targetFolder,
      isPublic
    )
  }

  for (const file of processedFiles) {
    try {
      if (operation === 'copy') {
        if (!isFile(file)) continue

        const result = await handleDuplicateWithValidation(
          client,
          file,
          targetFolder,
          { showAlert, t }
        )
        results.push({ success: true, file: result, operation: 'copy' })
      } else if (operation === 'cut') {
        const result = await handleMoveWithValidation(
          client,
          file,
          targetFolder,
          {
            sharingContext,
            showMoveValidationModal: options.showMoveValidationModal
          }
        )
        results.push({ success: true, file: result, operation: 'move' })
      }
    } catch (error) {
      results.push({ success: false, file, error, operation })
    }
  }

  return results
}

const handleDuplicateWithValidation = async (
  client,
  file,
  targetFolder,
  options = {}
) => {
  const { showAlert, t } = options

  const result = await copy(client, file, targetFolder)

  const isCopyingInsideNextcloud = targetFolder._type === NEXTCLOUD_FILE_ID
  if (isCopyingInsideNextcloud) {
    refreshNextcloudQueries(client, targetFolder)
  }

  if (showAlert && t) {
    showAlert({
      message: t('DuplicateModal.success', {
        smart_count: 1,
        fileName: file.name,
        destinationName:
          targetFolder._id === ROOT_DIR_ID
            ? t('breadcrumb.title_drive')
            : targetFolder.name
      }),
      severity: 'success'
    })
  }

  return result
}

const handleMoveWithValidation = async (
  client,
  file,
  targetFolder,
  options = {}
) => {
  const { sharingContext, showMoveValidationModal } = options

  if (
    sharingContext &&
    file.path &&
    targetFolder.path &&
    showMoveValidationModal
  ) {
    const { getSharedParentPath, hasSharedParent, byDocId } = sharingContext

    if (getSharedParentPath && hasSharedParent && byDocId) {
      try {
        const sharedParentPath = getSharedParentPath(file.path)
        const targetPath = joinPath(targetFolder.path, file.name)

        const areMovedFilesShared = hasOneOfEntriesShared([file], byDocId)
        const isOriginParentShared = hasSharedParent(file.path)
        const isTargetShared = hasSharedParent(targetPath)
        const isInsideSameSharedFolder =
          sharedParentPath && targetPath.startsWith(sharedParentPath)

        if (!isInsideSameSharedFolder) {
          if (isOriginParentShared && !isTargetShared) {
            return new Promise((resolve, reject) => {
              showMoveValidationModal(
                'moveOutside',
                file,
                targetFolder,
                async () => {
                  try {
                    const result = await move(client, file, targetFolder)
                    resolve(result)
                  } catch (error) {
                    reject(error)
                  }
                },
                () => reject(new Error('Move cancelled by user'))
              )
            })
          }

          if (!areMovedFilesShared && isTargetShared) {
            return new Promise((resolve, reject) => {
              showMoveValidationModal(
                'moveInside',
                file,
                targetFolder,
                async () => {
                  try {
                    const result = await move(client, file, targetFolder)
                    resolve(result)
                  } catch (error) {
                    reject(error)
                  }
                },
                () => reject(new Error('Move cancelled by user'))
              )
            })
          }

          if (areMovedFilesShared && isTargetShared) {
            return new Promise((resolve, reject) => {
              showMoveValidationModal(
                'moveSharedInside',
                file,
                targetFolder,
                async () => {
                  try {
                    const result = await move(client, file, targetFolder)
                    resolve(result)
                  } catch (error) {
                    reject(error)
                  }
                },
                () => reject(new Error('Move cancelled by user'))
              )
            })
          }
        }
      } catch (error) {
        logger.error('Failed to paste:', error)
      }
    }
  }

  if (file.needsRename) {
    await client.collection(DOCTYPE_FILES).update({
      ...file,
      name: file.uniqueName,
      _rev: file._rev || file.meta.rev
    })
  }
  const result = await move(client, file, targetFolder)

  const isMovingInsideNextcloud = targetFolder._type === NEXTCLOUD_FILE_ID
  const isMovingOutsideNextcloud =
    !isMovingInsideNextcloud && file._type === NEXTCLOUD_FILE_ID

  if (isMovingInsideNextcloud || isMovingOutsideNextcloud) {
    refreshNextcloudQueries(client, targetFolder, file, {
      isMovingInsideNextcloud,
      isMovingOutsideNextcloud
    })
  }

  return result
}

const refreshNextcloudQueries = (
  client,
  targetFolder,
  sourceFile = null,
  options = {}
) => {
  const { isMovingInsideNextcloud = false, isMovingOutsideNextcloud = false } =
    options

  if (isMovingInsideNextcloud || targetFolder._type === NEXTCLOUD_FILE_ID) {
    const queryId = computeNextcloudFolderQueryId({
      sourceAccount: targetFolder.cozyMetadata?.sourceAccount,
      path: targetFolder.path
    })
    client?.resetQuery(queryId)
  }

  if (isMovingOutsideNextcloud && sourceFile) {
    const queryId = computeNextcloudFolderQueryId({
      sourceAccount: sourceFile.cozyMetadata?.sourceAccount,
      path: sourceFile.path
    })
    client?.resetQuery(queryId)
  }
}
