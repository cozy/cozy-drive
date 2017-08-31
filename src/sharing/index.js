/* global cozy */
import { getTracker } from 'cozy-ui/react/helpers/tracker'

const track = (document, action) => {
  const tracker = getTracker()
  if (!tracker) {
    return
  }
  tracker.push(['trackEvent', isFile(document) ? 'Drive' : 'Photos', action, `${action}${isFile(document) ? 'File' : 'Album'}`])
}
const trackSharingByLink = (document) => track(document, 'shareByLink')
const trackSharingByEmail = (document) => track(document, 'shareByEmail')

export const filterSharedByLinkDocuments = (ids, doctype) =>
  fetchShareLinkPermissions(ids, doctype, 'collection').then(sets => sets.map(set => set.attributes.permissions['collection'].values[0]))

export const filterSharedWithMeDocuments = (ids, doctype) =>
  fetchSharedWithMePermissions(ids, doctype, 'rule0').then(sets => sets.map(set => set.attributes.permissions['rule0'].values[0]))

export const filterSharedWithOthersDocuments = (ids, doctype) =>
  fetchSharedWithOthersPermissions(ids, doctype, 'rule0').then(sets => sets.map(set => set.attributes.permissions['rule0'].values[0]))

const isFile = ({ type }) => type === 'directory' || type === 'file'
/**
 * SHARE BY LINK
 */

const createShareLinkPermission = (document) => {
  const { id, type } = document
  const permissions = isFile(document)
    ? {
      files: {
        type: 'io.cozy.files',
        verbs: ['GET'],
        values: [id]
      }
    }
    // TODO: this works for albums, but it needs to be generalized and integrated
    // with redux-cozy-client ; some sort of doctype "schema" will be needed here
    : {
      files: {
        type: 'io.cozy.files',
        verbs: ['GET'],
        values: [id],
        selector: 'referenced_by'
      },
      collection: {
        type: type,
        verbs: ['GET'],
        values: [id]
      }
    }
  return cozy.client.fetchJSON('POST', `/permissions?codes=email`, {
    data: {
      type: 'io.cozy.permissions',
      attributes: {
        permissions
      }
    }
  })
}

const getShareLinkPermission = (document) => {
  const { id, type } = document
  const doctype = isFile(document) ? 'io.cozy.files' : type
  const key = isFile(document) ? 'files' : 'collection'
  return fetchShareLinkPermissions([id], doctype, key)
  .then(permissions => permissions.length === 0 ? undefined : permissions[0])
}

const buildShareLink = (document, sharecode) =>
  `${window.location.origin}/public?sharecode=${sharecode}&id=${document.id}${document.type === 'file' ? '&directdownload' : ''}`

export const getShareLink = (document) =>
  getShareLinkPermission(document)
  .then(permission => permission ? { sharelink: buildShareLink(document, permission.attributes.codes.email), id: permission._id } : undefined)

export const createShareLink = (document) =>
  getShareLinkPermission(document)
  .then(permission => permission || createShareLinkPermission(document))
  .then(permission => ({ sharelink: buildShareLink(document, permission.attributes.codes.email), id: permission._id }))
  .then(sharing => {
    trackSharingByLink(document)
    return sharing
  })

/**
 * helpers
 */

export const SHARED_BY_LINK = 'sharedByLink'
export const SHARED_WITH_ME = 'sharedWithMe'
export const SHARED_WITH_OTHERS = 'sharedWithOthers'

const correctDoctype = (doctype) =>
  doctype === 'directory' || doctype === 'file' ? 'io.cozy.files' : doctype

const fetchPermissions = (sharingType) =>
  (ids, doctype, key) =>
    cozy.client.fetchJSON('GET', `/permissions/doctype/${correctDoctype(doctype)}/${sharingType}`)
      .then(permissions => permissions.filter(permission => {
        const obj = permission.attributes.permissions[key]
        return obj && obj.type === correctDoctype(doctype) && ids.find(id => obj.values.indexOf(id) !== -1) !== undefined
      })
    )

const fetchSharedWithMePermissions = fetchPermissions(SHARED_WITH_ME)
const fetchSharedWithOthersPermissions = fetchPermissions(SHARED_WITH_OTHERS)
const fetchShareLinkPermissions = fetchPermissions(SHARED_BY_LINK)

const fetchSharing = (id) => cozy.client.fetchJSON('GET', `/sharings/${id}`)

const fetchSharings = (ids) => Promise.all(ids.map(fetchSharing))

export const deletePermission = (id) =>
  cozy.client.fetchJSON('DELETE', `/permissions/${id}`)

const createContact = (email) => cozy.client.fetchJSON('POST', '/data/io.cozy.contacts/', {
  email: [{ address: email, primary: true }]
})

const createSharing = (document, contactId, sharingType = 'master-slave', description = '') => {
  const { id, type } = document
  const permissions = isFile(document)
    ? {
      files: {
        type: 'io.cozy.files',
        verbs: ['ALL'],
        values: [id]
      }
    }
    : {
      collection: {
        type,
        verbs: ['ALL'],
        values: [id]
      },
      files: {
        type: 'io.cozy.files',
        verbs: ['ALL'],
        values: [
          `${type}/${id}`
        ],
        selector: 'referenced_by'
      }
    }
  return cozy.client.fetchJSON('POST', '/sharings/', {
    desc: description,
    permissions,
    recipients: [
      {
        recipient: {
          id: contactId,
          type: 'io.cozy.contacts'
        }
      }
    ],
    sharing_type: sharingType
  })
}

const getContactId = ({ email, id }) => id
  ? Promise.resolve(id)
  : createContact(email).then((contact) => contact.id)

export const share = (document, recipient, sharingType, sharingDesc) =>
  getContactId(recipient)
    .then((id) => createSharing(document, id, sharingType, sharingDesc))
    .then(() => trackSharingByEmail(document))

export const getContacts = async (ids = []) => {
  const response = await cozy.client.fetchJSON('GET', '/data/io.cozy.contacts/_all_docs?include_docs=true', {keys: ids})
  return response.rows.map(row => row.doc).filter(doc => Array.isArray(doc.email))
}

const getPrimaryOrFirst = property => (obj) => {
  if (!obj[property] || obj[property].length === 0) return ''
  return obj[property].find(property => property.primary) || obj[property][0]
}

export const getPrimaryEmail = (contact) => getPrimaryOrFirst('email')(contact).address
export const getPrimaryCozy = (contact) => getPrimaryOrFirst('cozy')(contact).url

export const getRecipients = (document) =>
  fetchSharedWithOthersPermissions([document.id], document.type, 'rule0')
  .then(perms => perms.map(perm => perm.attributes.source_id))
  .then(fetchSharings)
  .then(sharings =>
    sharings.map(sharing =>
      sharing.attributes.recipients.map(info =>
        ({
          contactId: info.recipient.id,
          status: info.status,
          type: sharing.attributes.sharing_type
        })
      )
    )
  )
  .then(arrayOfArrays => [].concat(...arrayOfArrays))
  .then(async recipients => {
    const contacts = await getContacts(recipients.map(recipient => recipient.contactId))
    return recipients.map(recipient => ({
      ...recipient,
      contact: contacts.find(c => c._id === recipient.contactId)
    }))
  })

import ShareModal from './ShareModal'
import withSharings from './withSharings'

export { ShareModal, withSharings }
