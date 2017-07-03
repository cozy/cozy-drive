/* global cozy */
export const filterSharedByMeDocuments = (ids, doctype) =>
  findPermissionSets(ids, doctype, SHARED_BY_LINK).then(sets => sets.map(set => set.attributes.permissions.collection.values[0]))

export const filterSharedWithMeDocuments = (ids, doctype) =>
  findPermissionSets(ids, doctype, SHARED_WITH_ME).then(sets => sets.map(set => set.attributes.permissions.collection.values[0]))

export const findPermSet = (id, doctype) =>
  findPermissionSets([id], doctype, SHARED_BY_LINK).then(sets => sets.length === 0 ? undefined : sets[0])

// TODO: move this to cozy-client-js
// there is cozy.client.files.getCollectionShareLink already, but I think that
// there is a need of a bit of exploratory work and design for that API...

const SHARED_BY_LINK = 'sharedByLink'
const SHARED_WITH_ME = 'sharedWithMe'
const SHARED_WITH_OTHERS = 'sharedWithOthers'

export const findPermissionSets = (ids, doctype, sharingType) => {
  if ([SHARED_BY_LINK, SHARED_WITH_ME, SHARED_WITH_OTHERS].indexOf(sharingType) < 0) throw new Error('findPermissionSets expects a sharing type')

  return cozy.client.fetchJSON('GET', `/permissions/doctype/${doctype}/${sharingType}`)
    .then(sets => sets.filter(set => {
      const perm = set.attributes.permissions.collection
      return perm.type === doctype && ids.find(id => perm.values.indexOf(id) !== -1) !== undefined
    }))
}

export const createPermSet = (id, doctype) =>
  cozy.client.fetchJSON('POST', `/permissions?codes=email`, {
    data: {
      type: 'io.cozy.permissions',
      attributes: {
        permissions: {
          files: {
            type: 'io.cozy.files',
            verbs: ['GET'],
            values: [id],
            selector: 'referenced_by'
          },
          collection: {
            type: doctype,
            verbs: ['GET'],
            values: [id]
          }
        }
      }
    }
  })

export const share = async ({_id, _type, name}, email, url) => {
  const target = await cozy.client.fetchJSON('POST', '/sharings/recipient', {
    email,
    url
  })

  const sharings = await cozy.client.fetchJSON('POST', '/sharings/', {
    desc: name,
    permissions: {
      album: {
        description: 'album',
        type: _type,
        values: [
          _id
        ]
      },
      files: {
        description: 'photos',
        type: 'io.cozy.files',
        values: [
          `io.cozy.photos.albums/${_id}`
        ],
        selector: 'referenced_by'
      }
    },
    recipients: [
      {
        recipient: {
          id: target._id,
          type: 'io.cozy.recipients'
        }
      }
    ],
    sharing_type: 'master-slave'
  })

  return sharings
}

export const deletePermSet = (setId) =>
  cozy.client.fetchJSON('DELETE', `/permissions/${setId}`)

export const getShareLink = (id, perms) =>
  `${window.location.origin}/public?sharecode=${perms.attributes.codes.email}&id=${id}`

import ShareModal from './ShareModal'

export { ShareModal }
