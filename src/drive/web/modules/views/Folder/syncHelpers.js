import get from 'lodash/get'

/**
 * Whether there is a file referenced by a share id
 * @param {array} queryResults - List of folders and files
 * @param {string} sharingId - Id of an io.cozy.sharings doc
 * @returns {bool} true|false
 */
export const isThereFileReferencedBySharingId = (queryResults, sharingId) => {
  return queryResults.some(query => {
    return query.data.some(file => {
      const fileReferences =
        file.referenced_by && file.referenced_by.length >= 1
      if (fileReferences) {
        return file.referenced_by.some(reference => {
          if (reference.type === 'io.cozy.sharings') {
            return reference.id === sharingId
          }
          return false
        })
      }
      return false
    })
  })
}

/**
 * Remove a share from sharing context
 * @param {object} params - Params
 * @param {object} params.sharingsValue - Sharing Context value
 * @param {function} params.setSharingsValue - Sharing Context setter
 * @param {string} params.sharingId - Id of an io.cozy.sharings doc
 */
export const removeSharingFromContext = ({
  sharingsValue,
  setSharingsValue,
  sharingId
}) => {
  delete sharingsValue[sharingId]
  setSharingsValue(sharingsValue)
}

/**
 * Create a syncing fake file, necessary in the case of sharing without shortcut
 * This fake file shows a spinner the time it takes to recover the real file
 * @param {object} params - Params
 * @param {string} params.sharingId - Id of an io.cozy.sharings doc
 * @param {object} params.sharingsValue - Sharing Context value
 * @param {object} params.fileValue - Sharing Context file value
 * @returns {object} Syncing fake file
 */
export const createSyncingFakeFile = ({ sharingValue }) => {
  if (!sharingValue) {
    return null
  }
  return {
    name: sharingValue.attributes.description,
    id: sharingValue.id,
    type: 'directory'
  }
}

/**
 * Returns syncingFakeFile if it is still needed, otherwise remove the share in context
 * @param {object} params - Params
 * @param {array} params.queryResults - List of folders and files
 * @param {string} params.sharingId - Id of an io.cozy.sharings doc
 * @param {object} params.sharingsValue - Sharing Context value
 * @param {function} params.setSharingsValue - Sharing Context setter
 * @param {object} params.syncingFakeFile - Syncing fake file
 * @returns {object} Syncing fake file or null
 */
export const checkSyncingFakeFileObsolescence = ({
  queryResults,
  sharingId,
  sharingsValue,
  setSharingsValue,
  syncingFakeFile
}) => {
  const isThereRealtimeFileReferencedBySharing = isThereFileReferencedBySharingId(
    queryResults,
    sharingId
  )

  if (!isThereRealtimeFileReferencedBySharing) {
    return syncingFakeFile
  }

  removeSharingFromContext({ sharingsValue, setSharingsValue, sharingId })
  return null
}

/**
 * Create syncing fake file or check if it still longer needed
 * @param {object} params - Params
 * @param {boolean} params.isEmpty - Whether the query to fetch files returns nothing or error
 * @param {boolean} params.isSharingContextEmpty - Whether the sharing context is empty
 * @param {array} params.queryResults - List of folders and files
 * @param {string} params.sharingId - Id of an io.cozy.sharings doc
 * @param {object} params.sharingsValue - Sharing Context value
 * @param {function} params.setSharingsValue - Sharing Context setter
 * @param {object} params.fileValue - Sharing Context file value
 * @returns {object} Syncing fake file
 */
export const computeSyncingFakeFile = ({
  isEmpty,
  isSharingContextEmpty,
  queryResults,
  sharingId,
  sharingsValue,
  setSharingsValue,
  fileValue
}) => {
  if (isEmpty || isSharingContextEmpty) {
    return null
  }

  const sharingValue = sharingsValue[sharingId]

  if (fileValue || !sharingValue) {
    return null
  }

  const syncingFakeFile = createSyncingFakeFile({
    sharingValue
  })

  const updatedSyncingFakeFile = checkSyncingFakeFileObsolescence({
    syncingFakeFile,
    queryResults,
    sharingId,
    sharingsValue,
    setSharingsValue,
    fileValue
  })

  return updatedSyncingFakeFile
}

/**
 * Whether the file is referenced by a share in the sharing context
 * @param {object} file - An io.cozy.files doc
 * @param {object} sharingsValue - Sharing Context value
 * @returns {bool}
 */
export const isReferencedByShareInSharingContext = (file, sharingsValue) => {
  const fileReferences = get(file, 'relationships.referenced_by.data')
  if (!fileReferences) return false

  const fileSharingId = fileReferences.find(
    reference => reference.type === 'io.cozy.sharings'
  ).id

  return get(sharingsValue, fileSharingId, false) !== false
}
