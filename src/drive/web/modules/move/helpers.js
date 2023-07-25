import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import { CozyFile } from 'models'
import logger from 'lib/logger'

/**
 * Returns whether one of the targeted folders is part of the current folder
 * @param {object[]} targets List of folders
 * @param {string} currentDirId The id of the current folder
 * @returns {boolean} whether one of the targeted folders is part of the current folder
 */
export const areTargetsInCurrentDir = (targets, currentDirId) => {
  const targetsInCurrentDir = targets.filter(
    target => target.dir_id === currentDirId
  )
  return targetsInCurrentDir.length === targets.length
}

/**
 * Cancel file movement function
 * @param {object} client - The CozyClient instance
 * @param {object[]} entries - List of files moved
 * @param {string[]} trashedFiles - List of ids for files moved to the trash
 * @param {Function} registerCancelable - Function to register the promise
 * @param {Functione} refreshSharing - Function refresh sharing state
 */
export const cancelMove = async ({
  client,
  entries,
  trashedFiles,
  registerCancelable,
  refreshSharing
}) => {
  try {
    await Promise.all(
      entries.map(entry =>
        registerCancelable(CozyFile.move(entry._id, { folderId: entry.dir_id }))
      )
    )
    const fileCollection = client.collection(CozyFile.doctype)
    let restoreErrorsCount = 0
    await Promise.all(
      trashedFiles.map(id => {
        try {
          registerCancelable(fileCollection.restore(id))
        } catch {
          restoreErrorsCount++
        }
      })
    )
    if (restoreErrorsCount) {
      Alerter.info('Move.cancelledWithRestoreErrors', {
        subject: entries.length === 1 ? entries[0].name : '',
        smart_count: entries.length,
        restoreErrorsCount
      })
    } else {
      Alerter.info('Move.cancelled', {
        subject: entries.length === 1 ? entries[0].name : '',
        smart_count: entries.length
      })
    }
  } catch (e) {
    logger.warn(e)
    Alerter.error('Move.cancelled_error', { smart_count: entries.length })
  } finally {
    if (refreshSharing) refreshSharing()
  }
}
