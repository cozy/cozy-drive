import { Q, fetchPolicies } from 'cozy-client'

import { DOCTYPE_ALBUMS, DOCTYPE_FILES } from 'drive/lib/doctypes'

const older30s = 30 * 1000

export const buildTimelineQuery = () => ({
  definition: Q(DOCTYPE_FILES)
    .where({
      class: 'image',
      'metadata.datetime': {
        $gt: null
      }
    })
    .partialIndex({
      trashed: false
    })
    .indexFields(['class', 'metadata.datetime'])
    .select([
      'dir_id',
      'name',
      'size',
      'updated_at',
      'metadata',
      'metadata.datetime',
      'trashed',
      'class'
    ])
    .sortBy([
      {
        class: 'desc'
      },
      {
        'metadata.datetime': 'desc'
      }
    ])
    .include(['albums']),
  options: {
    as: 'timeline',
    fetchPolicy: fetchPolicies.olderThan(older30s)
  }
})

export const buildPhotosTrashedWithReferencedBy = () => ({
  definition: Q(DOCTYPE_FILES).partialIndex({
    class: 'image',
    trashed: true,
    referenced_by: {
      $exists: true
    }
  }),
  options: {
    as: `${DOCTYPE_FILES}/class/image/trashed/referenced_by`,
    fetchPolicy: fetchPolicies.olderThan(older30s)
  }
})

// Albums doctype -------------

export const buildAlbumsQuery = albumId => ({
  definition: Q(DOCTYPE_ALBUMS).getById(albumId).include(['photos']),
  options: {
    as: `albums-${albumId}`,
    singleDocData: true,
    fetchPolicy: fetchPolicies.olderThan(older30s)
  }
})
