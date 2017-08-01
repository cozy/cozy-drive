/* global cozy */
export const filterSharedByLinkDocuments = (ids, doctype) =>
  fetchShareLinkPermissions(ids, doctype, 'collection').then(sets => sets.map(set => set.attributes.permissions['collection'].values[0]))

export const filterSharedWithMeDocuments = (ids, doctype) =>
  fetchSharedWithMePermissions(ids, doctype, 'collection').then(sets => sets.map(set => set.attributes.permissions['collection'].values[0]))

export const filterSharedWithOthersDocuments = (id, doctype) =>
  fetchSharedWithOthersPermissions([id], doctype, 'rule0')

// TODO: move this to cozy-client-js
// there is cozy.client.files.getCollectionShareLink already, but I think that
// there is a need of a bit of exploratory work and design for that API...

/**
 * SHARE BY LINK
 */

export const createShareLinkPermission = (id, doctype) =>
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

export const fetchShareLinkPermission = (id, doctype) =>
  fetchShareLinkPermissions([id], doctype, 'collection').then(sets => sets.length === 0 ? undefined : sets[0])

export const getShareLink = (id, permission) =>
  `${window.location.origin}/public?sharecode=${permission.attributes.codes.email}&id=${id}`

export const createShareLink = (id, doctype = 'io.cozy.photos.albums') =>
  fetchShareLinkPermission(id, doctype)
  .then(permission => permission ? Promise.resolve(permission) : createShareLinkPermission(id, doctype))
  .then(permission => ({ sharelink: getShareLink(id, permission), id: permission._id }))

/**
 * helpers
 */

const SHARED_BY_LINK = 'sharedByLink'
const SHARED_WITH_ME = 'sharedWithMe'
const SHARED_WITH_OTHERS = 'sharedWithOthers'

const fetchPermissions = (sharingType) =>
  (ids, doctype, key) =>
    cozy.client.fetchJSON('GET', `/permissions/doctype/${doctype}/${sharingType}`)
      .then(sets => sets.filter(set => {
        const permission = set.attributes.permissions[key]
        return permission && permission.type === doctype && ids.find(id => permission.values.indexOf(id) !== -1) !== undefined
      })
    )

export const fetchSharedWithMePermissions = fetchPermissions(SHARED_WITH_ME)
export const fetchSharedWithOthersPermissions = fetchPermissions(SHARED_WITH_OTHERS)
export const fetchShareLinkPermissions = fetchPermissions(SHARED_BY_LINK)

const fetchSharing = (id) => cozy.client.fetchJSON('GET', `/sharings/${id}`)

const fetchSharings = (ids) => Promise.all(ids.map(fetchSharing))

export const deletePermission = (id) =>
  cozy.client.fetchJSON('DELETE', `/permissions/${id}`)

const createRecipient = (email, url) => cozy.client.fetchJSON('POST', '/sharings/recipient', {
  email,
  url
})

const createSharing = (id, description, recipient, sharingType = 'master-slave') =>
  cozy.client.fetchJSON('POST', '/sharings/', {
    desc: description,
    permissions: {
      album: {
        description: 'album',
        type: 'io.cozy.photos.albums',
        values: [id]
      },
      files: {
        description: 'photos',
        type: 'io.cozy.files',
        values: [
          `io.cozy.photos.albums/${id}`
        ],
        selector: 'referenced_by'
      }
    },
    recipients: [
      {
        recipient: {
          id: recipient._id,
          type: 'io.cozy.contacts'
        }
      }
    ],
    sharing_type: sharingType
  })

export const share = ({ _id, name }, email, url) =>
  createRecipient(email, url).then(
    (recipient) => createSharing(_id, name, recipient)
  )

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
  .then(fetchSharings)
  .then(sharings =>
    sharings.map(sharing =>
      sharing.attributes.recipients.map(info =>
        ({
          id: info.recipient.id,
          status: info.status,
          type: sharing.attributes.sharing_type
        })
      )
    )
  )
  .then(arrayOfArrays => [].concat(...arrayOfArrays))
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
