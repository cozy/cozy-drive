import CozyClient, { Q, QueryDefinition } from 'cozy-client'
import { QueryOptions } from 'cozy-client/types/types'

import { SHARED_DRIVES_DIR_ID, TRASH_DIR_ID } from 'constants/config'
import { DOCTYPE_FILES_ENCRYPTION, DOCTYPE_ALBUMS } from 'lib/doctypes'
import { formatFolderQueryId } from 'lib/queries'

interface QueryConfig {
  definition: () => QueryDefinition
  options: QueryOptions
}

type QueryBuilder<T = void> = (params: T) => QueryConfig

interface buildDriveQueryParams {
  currentFolderId: string
  type: string
  sortAttribute: string
  sortOrder: string
}

// Needs to be less than 10 minutes, since "thumbnails" links
// are only valid for 10 minutes.
// cf https://github.com/cozy/cozy-doctypes/blob/master/docs/io.cozy.files.md#files
const DEFAULT_CACHE_TIMEOUT_QUERIES = 9 * 60 * 1000
const defaultFetchPolicy = CozyClient.fetchPolicies.olderThan(
  DEFAULT_CACHE_TIMEOUT_QUERIES
)

export const buildDriveQuery: QueryBuilder<buildDriveQueryParams> = ({
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
        // This is to avoid fetching shared drives
        // They are hidden clientside
        _id: {
          $nin: [TRASH_DIR_ID]
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

export const buildRecentQuery: QueryBuilder = () => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        updated_at: {
          $gt: null
        }
      })
      .partialIndex({
        type: 'file',
        trashed: false,
        dir_id: { $ne: SHARED_DRIVES_DIR_ID }
      })
      .indexFields(['updated_at'])
      .sortBy([{ updated_at: 'desc' }])
      .limitBy(50),
  options: {
    as: 'recent-view-query',
    fetchPolicy: defaultFetchPolicy
  }
})

interface buildRecentWithMetadataAttributeQueryParams {
  attribute: string
}

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
export const buildRecentWithMetadataAttributeQuery: QueryBuilder<
  buildRecentWithMetadataAttributeQueryParams
> = ({ attribute }) => ({
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

export const buildParentsByIdsQuery: QueryBuilder<string[]> = ids => ({
  definition: () => Q('io.cozy.files').getByIds(ids),
  options: {
    as: `parents-by-ids-${ids.join('')}`,
    fetchPolicy: defaultFetchPolicy
  }
})

interface buildSharingsQueryParams {
  ids: string[]
  enabled?: boolean
}

export const buildSharingsQuery: QueryBuilder<buildSharingsQueryParams> = ({
  ids,
  enabled = true
}) => ({
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

interface buildSharingsWithMetadataAttributeQueryParams {
  sharedDocumentIds: string[]
  attribute: string
}

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
export const buildSharingsWithMetadataAttributeQuery: QueryBuilder<
  buildSharingsWithMetadataAttributeQueryParams
> = ({ sharedDocumentIds, attribute }) => ({
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

interface buildTrashQueryParams {
  currentFolderId: string
  sortAttribute: string
  sortOrder: string
  type: string
  limit?: number
}

export const buildTrashQuery: QueryBuilder<buildTrashQueryParams> = ({
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

export const buildMoveOrImportQuery: QueryBuilder<string> = dirId => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: dirId,
        type: { $gt: null },
        name: { $gt: null }
      })
      .partialIndex({
        // This is to avoid fetching shared drives and trash
        // They are hidden clientside
        _id: {
          $nin: [SHARED_DRIVES_DIR_ID, TRASH_DIR_ID]
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

export const buildFolderQuery: QueryBuilder<string> = folderId => ({
  definition: () =>
    Q('io.cozy.files').getById(folderId).include(['encryption', 'parent']),
  options: {
    as: 'folder-' + folderId,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildOnlyFolderQuery: QueryBuilder<string> = folderId => ({
  definition: () => Q('io.cozy.files').getById(folderId),
  options: {
    as: 'onlyfolder-' + folderId,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

interface buildFileWithSpecificMetadataAttributeQueryParams {
  currentFolderId: string
  attribute: string
}

// TODO: since this query is almost the same as buildDriveQuery
// we can probably refactor a bit
// see https://github.com/cozy/cozy-drive/pull/2193#pullrequestreview-553766674
/**
 * Returns one file with specific metadata.
 * Only one file is necessary because it allows us to know whether or not to display
 * the column for this specific metadata (like carbonCopy or electronicSafe).
 * @param {string} currentFolderId - Id of the current folder
 * @param {string} attribute - Metadata
 */
export const buildFileWithSpecificMetadataAttributeQuery: QueryBuilder<
  buildFileWithSpecificMetadataAttributeQueryParams
> = ({ currentFolderId, attribute }) => ({
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

export const buildFileByIdQuery: QueryBuilder<string> = fileId => ({
  definition: () => Q('io.cozy.files').getById(fileId),
  options: {
    as: `io.cozy.files/${fileId}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildAppsQuery: QueryBuilder = () => ({
  definition: () => Q('io.cozy.apps'),
  options: {
    as: `io.cozy.apps`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildSettingsByIdQuery: QueryBuilder<string> = id => ({
  definition: () => Q('io.cozy.settings').getById(id),
  options: {
    as: `io.cozy.settings/${id}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildEncryptionByIdQuery: QueryBuilder<string> = id => ({
  definition: () => Q(DOCTYPE_FILES_ENCRYPTION).getById(id),
  options: {
    as: id,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildAlbumByIdQuery: QueryBuilder<string> = id => ({
  definition: () => Q(DOCTYPE_ALBUMS).getById(id),
  options: {
    as: `io.cozy.photos.albums/${id}`,
    fetchPolicy: defaultFetchPolicy,
    singleDocData: true
  }
})

export const buildFolderByPathQuery: QueryBuilder<string> = path => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        type: 'directory',
        path
      })
      .indexFields(['type', ' path']),
  options: {
    as: `io.cozy.files/path${path}`,
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildNewSharingShortcutQuery: QueryBuilder = () => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        'metadata.sharing.status': 'new',
        class: 'shortcut',
        trashed: false
      })
      .indexFields(['metadata.sharing.status', 'class', 'trashed']),
  options: {
    as: 'io.cozy.files/metadata.sharing.status/new/class/shortcut',
    fetchPolicy: defaultFetchPolicy
  }
})

export const buildTriggersQueryByAccountId: QueryBuilder<
  string
> = accountId => ({
  definition: () =>
    Q('io.cozy.triggers')
      .where({
        'message.account': accountId
      })
      .indexFields(['message.account']),
  options: {
    as: `${'io.cozy.triggers'}/accounts/${accountId}`,
    enabled: Boolean(accountId),
    fetchPolicy: defaultFetchPolicy
  }
})

interface buildKonnectorsQueryByIdParams {
  id: string
  enabled?: boolean
}

export const buildKonnectorsQueryById: QueryBuilder<
  buildKonnectorsQueryByIdParams
> = ({ id, enabled = true }) => ({
  definition: () => Q('io.cozy.konnectors').getById(id),
  options: {
    as: `io.cozy.konnectors/${id}`,
    fetchPolicy: defaultFetchPolicy,
    enabled
  }
})

export const buildTriggersQueryByKonnectorSlug: QueryBuilder<
  string
> = slug => ({
  definition: () =>
    Q('io.cozy.triggers')
      .where({
        'message.konnector': slug
      })
      .indexFields(['message.konnector']),
  options: {
    as: `io.cozy.triggers/slug/${slug}`,
    fetchPolicy: defaultFetchPolicy,
    enabled: Boolean(slug)
  }
})
