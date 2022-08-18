import CozyClient, { Q } from 'cozy-client'
import { TRASH_DIR_ID } from 'drive/constants/config'
import { DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'

// Needs to be less than 10 minutes, since "thumbnails" links
// are only valid for 10 minutes.
// cf https://github.com/cozy/cozy-doctypes/blob/master/docs/io.cozy.files.md#files
const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const parseFolderQueryId = maybeFolderQueryId => {
  const splitted = maybeFolderQueryId.split(' ')
  if (splitted.length !== 4) {
    return null
  }
  return {
    type: splitted[0],
    folderId: splitted[1],
    sortAttribute: splitted[2],
    sortOrder: splitted[3]
  }
}

export const formatFolderQueryId = (
  type,
  folderId,
  sortAttribute,
  sortOrder
) => {
  return `${type} ${folderId} ${sortAttribute} ${sortOrder}`
}

const buildDriveQuery = ({
  currentFolderId,
  type,
  sortAttribute,
  sortOrder
}) => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: currentFolderId,
        type,
        [sortAttribute]: { $gt: null }
      })
      .partialIndex({
        _id: {
          $ne: TRASH_DIR_ID
        }
      })
      .indexFields(['dir_id', 'type', sortAttribute])
      .sortBy([
        { dir_id: sortOrder },
        { type: sortOrder },
        { [sortAttribute]: sortOrder }
      ])
      .include(['encryption'])
      .limitBy(100),
  options: {
    as: formatFolderQueryId(type, currentFolderId, sortAttribute, sortOrder),
    fetchPolicy: defaultFetchPolicy
  }
})

const buildRecentQuery = () => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        type: 'file',
        trashed: false,
        updated_at: {
          $gt: null
        }
      })
      .indexFields(['type', 'trashed', 'updated_at'])
      .sortBy([{ type: 'desc' }, { trashed: 'desc' }, { updated_at: 'desc' }])
      .limitBy(50),
  options: {
    as: 'recent-view-query',
    fetchPolicy: defaultFetchPolicy
  }
})

// TODO: since this query is almost the same as buildRecentQuery
// we can probably refactor a bit
// see https://github.com/cozy/cozy-drive/pull/2193#pullrequestreview-553766674
/**
 * Returns one file with specific metadata for Recent view
 * Only one file is necessary because it allows us to know whether or not to display
 * the column for this specific metadata (like carbonCopy or electronicSafe).
 * @param {object} params - Params
 * @param {string} params.attribute - Metadata attribute
 */
export const buildRecentWithMetadataAttributeQuery = ({ attribute }) => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        type: 'file',
        trashed: false,
        [`metadata.${attribute}`]: true,
        updated_at: {
          $gt: null
        }
      })
      .indexFields([`metadata.${attribute}`, 'type', 'trashed', 'updated_at'])
      .limitBy(1),
  options: {
    as: `recent-view-query-with-${attribute}`,
    fetchPolicy: defaultFetchPolicy
  }
})

const buildParentsByIdsQuery = ids => ({
  definition: () => Q('io.cozy.files').getByIds(ids),
  options: {
    as: `parents-by-ids-${ids.join('')}`,
    fetchPolicy: defaultFetchPolicy
  }
})

const buildSharingsQuery = ({ ids, enabled = true }) => ({
  definition: () =>
    Q('io.cozy.files')
      .getByIds(ids)
      .sortBy([{ type: 'asc' }, { name: 'asc' }]),
  options: {
    as: `sharings-by-ids-${ids.join('')}`,
    enabled,
    fetchPolicy: defaultFetchPolicy
  }
})

// TODO: since this query is almost the same as buildSharingsQuery
// we can probably refactor a bit
// see https://github.com/cozy/cozy-drive/pull/2193#pullrequestreview-553766674
/**
 * Returns one file with specific metadata for Sharing view.
 * Only one file is necessary because it allows us to know whether or not to display
 * the column for this specific metadata (like carbonCopy or electronicSafe).
 * @param {object} params - Params
 * @param {array} params.sharedDocumentsIds - Ids of shared documents
 * @param {string} params.attribute - Metadata attribute
 */
export const buildSharingsWithMetadataAttributeQuery = ({
  sharedDocumentIds,
  attribute
}) => ({
  definition: () =>
    Q('io.cozy.files')
      .getByIds(sharedDocumentIds)
      .where({ [`metadata.${attribute}`]: true })
      .limitBy(1),
  options: {
    as: `sharings-by-ids-${sharedDocumentIds.join('')}-with-${attribute}`,
    fetchPolicy: defaultFetchPolicy
  }
})

const buildTrashQuery = ({
  currentFolderId,
  sortAttribute,
  sortOrder,
  type,
  limit
}) => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: currentFolderId,
        type,
        [sortAttribute]: { $gt: null }
      })
      .indexFields(['dir_id', 'type', sortAttribute])
      .sortBy([
        { dir_id: sortOrder },
        { type: sortOrder },
        { [sortAttribute]: sortOrder }
      ])
      .limitBy(limit ? limit : 100),
  options: {
    as: `trash-${formatFolderQueryId(
      type,
      currentFolderId,
      sortAttribute,
      sortOrder
    )}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(
      DEFAULT_CACHE_TIMEOUT_QUERIES
    )
  }
})

export const buildMoveOrImportQuery = dirId => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: dirId,
        type: { $gt: null },
        name: { $gt: null }
      })
      .partialIndex({
        _id: {
          $ne: TRASH_DIR_ID
        }
      })
      .indexFields(['dir_id', 'type', 'name'])
      .sortBy([{ dir_id: 'asc' }, { type: 'asc' }, { name: 'asc' }])
      .limitBy(100),
  options: {
    as: `moveOrImport-${dirId}`,
    fetchPolicy: CozyClient.fetchPolicies.olderThan(
      DEFAULT_CACHE_TIMEOUT_QUERIES
    )
  }
})

/**
 * Get the query for folder if given the query for files
 * and vice versa.
 *
 * If given the queryId `directory id123 name desc`, will return
 * the query `files id123 name desc`.
 */
export const getMirrorQueryId = queryId => {
  const { type, folderId, sortAttribute, sortOrder } =
    parseFolderQueryId(queryId)
  const otherType = type === 'directory' ? 'file' : 'directory'
  const otherQueryId = formatFolderQueryId(
    otherType,
    folderId,
    sortAttribute,
    sortOrder
  )
  return otherQueryId
}

export const buildFolderQuery = folderId => ({
  definition: () =>
    Q('io.cozy.files').getById(folderId).include(['encryption', 'parent']),
  options: {
    as: 'folder-' + folderId,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildOnlyFolderQuery = folderId => ({
  definition: () => Q('io.cozy.files').getById(folderId),
  options: {
    as: 'onlyfolder-' + folderId,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

// TODO: since this query is almost the same as buildDriveQuery
// we can probably refactor a bit
// see https://github.com/cozy/cozy-drive/pull/2193#pullrequestreview-553766674
/**
 * Returns one file with specific metadata.
 * Only one file is necessary because it allows us to know whether or not to display
 * the column for this specific metadata (like carbonCopy or electronicSafe).
 * @param {string} currentFolderId - Id of the current folder
 * @param {string} attribute - Metadata attribute
 */
export const buildFileWithSpecificMetadataAttributeQuery = ({
  currentFolderId,
  attribute
}) => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: currentFolderId,
        [`metadata.${attribute}`]: true,
        type: 'file'
      })
      .indexFields(['dir_id', `metadata.${attribute}`, 'type'])
      .limitBy(1),
  options: {
    as: `specific-metadata-${attribute}-for-${currentFolderId}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildSharingsByIdQuery = sharingId => ({
  definition: Q('io.cozy.sharings').getById(sharingId),
  options: {
    as: `io.cozy.sharings/${sharingId}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildFileByIdQuery = fileId => ({
  definition: () => Q('io.cozy.files').getById(fileId),
  options: {
    as: `io.cozy.files/${fileId}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildAppsQuery = () => ({
  definition: Q('io.cozy.apps'),
  options: {
    as: `io.cozy.apps`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildSettingsByIdQuery = id => ({
  definition: Q('io.cozy.settings').getById(id),
  options: {
    as: `io.cozy.settings/${id}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildEncryptionByIdQuery = id => ({
  definition: Q(DOCTYPE_FILES_ENCRYPTION).getById(id),
  options: {
    as: id,
    fetchPolicy: defaultFetchPolicy
  }
})

/**
 * Provide options to fetch files
 *
 * @returns {MangoQueryOptions} A minimalist file list
 */
export const prepareSuggestionQuery = () => ({
  partialFilter: {
    _id: {
      $ne: TRASH_DIR_ID
    },
    path: {
      // this predicate is necessary until the trashed attribute is more reliable
      $or: [{ $exists: false }, { $regex: '^(?!/.cozy_trash)' }]
    },
    trashed: {
      $or: [{ $exists: false }, { $eq: false }]
    }
  },
  fields: [
    '_id',
    'trashed',
    'dir_id',
    'name',
    'path',
    'type',
    'mime',
    'metadata'
  ],
  indexedFields: ['_id'],
  limit: 1000
})

export {
  buildDriveQuery,
  buildRecentQuery,
  buildParentsByIdsQuery,
  buildSharingsQuery,
  buildTrashQuery
}
