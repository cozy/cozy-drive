import { Q, fetchPolicies } from 'cozy-client'

const older30s = 30 * 1000

// Export to doctypes
const FILES_DOCTYPE = 'io.cozy.files'

export const buildTimelineQuery = () => ({
  definition: Q(FILES_DOCTYPE)
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
