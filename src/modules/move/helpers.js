import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import { CozyFile } from 'models'

import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import { ROOT_DIR_ID } from 'constants/config'
import logger from 'lib/logger'

/**
 * Returns whether one of the targeted folders is part of the current folder
 * @param {import('cozy-client/types').IOCozyFile[]} targets - List of folders
 * @param {string} currentDirId - The id of the current folder
 * @returns {boolean} - Whether one of the targeted folders is part of the current folder
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
 * @param {import('cozy-client/types').IOCozyFile[]} entries - List of files moved
 * @param {import('cozy-client/types').IOCozyFile[]} trashedFiles - List of ids for files moved to the trash
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

/**
 * Gets a name for the entry if there is only one, or a sentence with the number of elements if there are several
 * @param {import('cozy-client/types').IOCozyFile[]} entries - List of files moved
 * @param {Function} t - Translation function
 * @returns {string} - Name for entries
 */
export const getEntriesName = (entries, t) => {
  return entries.length !== 1
    ? t('Move.multipleEntries', {
        smart_count: entries.length
      })
    : entries[0].name
}

/**
 * @typedef {Object} SharedDoc
 * @property {string[]} permissions - List of permissions
 * @property {string[]} sharings - List of sharings
 */

/**
 * Returns whether one of the entries that is shared not only by link
 * @param {import('cozy-client/types').IOCozyFile[]} entries - List of files moved
 * @param {Object<string, SharedDoc>} byDocId - Object with shared files by id from cozy-sharing
 * @returns {boolean} - Whether one of the entries that is shared not only by link
 */
export const hasOneOfEntriesShared = (entries, byDocId) => {
  const sharedEntries = entries.filter(({ _id }) => {
    const doc = byDocId[_id]
    if (doc === undefined) return false

    const onlySharedByLink =
      doc.permissions.length > 0 && doc.sharings.length === 0

    if (onlySharedByLink) return false

    return true
  })
  return sharedEntries.length > 0
}

export const getBreadcrumbPath = (t, displayedFolder) =>
  uniqBy(
    [
      {
        _id: ROOT_DIR_ID
      },
      {
        _id: get(displayedFolder, 'dir_id')
      },
      {
        _id: displayedFolder._id,
        name: displayedFolder.name
      }
    ],
    '_id'
  )
    .filter(({ _id }) => Boolean(_id))
    .map(breadcrumb => ({
      _id: breadcrumb._id,
      name:
        breadcrumb.name ||
        (breadcrumb._id === ROOT_DIR_ID ? t('breadcrumb.title_drive') : '…')
    }))
