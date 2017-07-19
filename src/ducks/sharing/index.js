/* global cozy */
export const filterSharedByLinkDocuments = (ids, doctype) =>
  findPermissionSets(ids, doctype, SHARED_BY_LINK, 'collection').then(sets => sets.map(set => set.attributes.permissions['collection'].values[0]))

export const filterSharedWithMeDocuments = (ids, doctype) =>
  findPermissionSets(ids, doctype, SHARED_WITH_ME, 'collection').then(sets => sets.map(set => set.attributes.permissions['collection'].values[0]))

export const filterSharedWithOthersDocuments = (id, doctype) =>
  findPermissionSets([id], doctype, SHARED_WITH_OTHERS, 'rule0')

export const findPermSetByLink = (id, doctype) =>
  findPermissionSets([id], doctype, SHARED_BY_LINK, 'collection').then(sets => sets.length === 0 ? undefined : sets[0])

// TODO: move this to cozy-client-js
// there is cozy.client.files.getCollectionShareLink already, but I think that
// there is a need of a bit of exploratory work and design for that API...

const SHARED_BY_LINK = 'sharedByLink'
const SHARED_WITH_ME = 'sharedWithMe'
const SHARED_WITH_OTHERS = 'sharedWithOthers'

export const findPermissionSets = (ids, doctype, sharingType, permissionsName) => {
  if ([SHARED_BY_LINK, SHARED_WITH_ME, SHARED_WITH_OTHERS].indexOf(sharingType) < 0) throw new Error('findPermissionSets expects a sharing type')

  return cozy.client.fetchJSON('GET', `/permissions/doctype/${doctype}/${sharingType}`)
    .then(sets => sets.filter(set => {
      const perm = set.attributes.permissions[permissionsName]
      return perm.type === doctype && ids.find(id => perm.values.indexOf(id) !== -1) !== undefined
    }))
}

export const findSharings = ids => {
  const promises = ids.map(id => cozy.client.fetchJSON('GET', `/sharings/${id}`))
  return Promise.all(promises)
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
          type: 'io.cozy.contacts'
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

export const getContacts = async (ids = []) => {
  const response = await cozy.client.fetchJSON('GET', '/data/io.cozy.contacts/_all_docs?include_docs=true', {keys: ids})
  return response.rows.map(row => row.doc)
}

const getProperty = (property, comparator) => (list, id) => {
  const wantedItem = list.find(comparator(id)) || {}
  return wantedItem[property]
}

const getEmail = getProperty('email', id => item => item._id === id)
const getUrl = getProperty('url', id => item => item._id === id)

export const getRecipients = (id, type) => filterSharedWithOthersDocuments(id, type)
  .then(perms => perms.map(perm => perm.attributes.source_id))
  .then(findSharings)
  .then(sharings => sharings.map(sharing => sharing.attributes.recipients))
  .then(arrayOfArrays => [].concat(...arrayOfArrays))
  .then(recipients => recipients.map(info => ({
    id: info.recipient.id,
    status: info.status
  })))
  .then(async recipients => {
    const ids = recipients.map(recipient => recipient.id)
    const contacts = await getContacts(ids)
    return recipients.map(recipient => ({
      ...recipient,
      email: getEmail(contacts, recipient.id),
      url: getUrl(contacts, recipient.id)
    }))
  })

import ShareModal from './ShareModal'

export { ShareModal }
