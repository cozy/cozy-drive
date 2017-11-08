import { combineReducers } from 'redux'
import { getTracker } from 'cozy-ui/react/helpers/tracker'
import { getDocument, createDocument, fetchCollection } from '../reducer'

export const FETCH_SHARINGS = 'FETCH_SHARINGS'
const RECEIVE_SHARINGS_DATA = 'RECEIVE_SHARINGS_DATA'
const RECEIVE_FETCH_SHARINGS_ERROR = 'RECEIVE_FETCH_SHARINGS_ERROR'
const CREATE_SHARING = 'CREATE_SHARING'
const RECEIVE_NEW_SHARING = 'RECEIVE_NEW_SHARING'
const CREATE_SHARING_LINK = 'CREATE_SHARING_LINK'
const RECEIVE_NEW_SHARING_LINK = 'RECEIVE_NEW_SHARING_LINK'
const REVOKE_SHARING_LINK = 'REVOKE_SHARING_LINK'
const RECEIVE_SHARING_LINK_REVOKE = 'RECEIVE_SHARING_LINK_REVOKE'
const REVOKE_SHARING = 'REVOKE_SHARING'
const RECEIVE_SHARING_REVOKE = 'RECEIVE_SHARING_REVOKE'
const RECEIVE_ERROR = 'RECEIVE_ERROR'

const removeRecipient = (recipients, recipientId) => {
  const idx = recipients.findIndex(r => r.recipient.id === recipientId)
  return [...recipients.slice(0, idx), ...recipients.slice(idx + 1)]
}

const documents = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SHARINGS_DATA:
      return action.response.sharings
    case RECEIVE_NEW_SHARING:
      return [...state, action.response]
    case RECEIVE_SHARING_REVOKE:
      const idx = state.findIndex(
        s => s.attributes.sharing_id === action.sharingId
      )
      if (idx === -1) return state
      const sharing = state[idx]
      const loneRecipient =
        sharing.attributes.recipients === undefined || // for recipient-side revocation
        sharing.attributes.recipients.length === 1
      const newState = loneRecipient
        ? { ...sharing, attributes: { ...sharing.attributes, revoked: true } }
        : {
            ...sharing,
            attributes: {
              ...sharing.attributes,
              recipients: removeRecipient(
                sharing.attributes.recipients,
                action.recipientId
              )
            }
          }
      return [...state.slice(0, idx), newState, ...state.slice(idx + 1)]
    default:
      return state
  }
}

const doctypePermsetInitialState = {
  fetchStatus: 'loading',
  byMe: [],
  byLink: [],
  withMe: []
}

const permissions = (state = {}, action) => {
  let idx
  switch (action.type) {
    case FETCH_SHARINGS:
      if (state[action.doctype]) {
        return {
          ...state,
          [action.doctype]: { ...state[action.doctype], fetchStatus: 'loading' }
        }
      }
      return { ...state, [action.doctype]: doctypePermsetInitialState }
    case RECEIVE_SHARINGS_DATA:
      return {
        ...state,
        [action.doctype]: {
          fetchStatus: 'loaded',
          ...action.response.permissions
        }
      }
    case RECEIVE_FETCH_SHARINGS_ERROR:
      return { ...state, [action.doctype]: { fetchStatus: 'error' } }
    case RECEIVE_NEW_SHARING:
      return {
        ...state,
        [action.doctype]: {
          ...state[action.doctype],
          byMe: [
            ...state[action.doctype].byMe,
            {
              attributes: {
                permissions: {
                  rule0: { type: action.doctype, values: [action.id] }
                },
                source_id: action.response.attributes.sharing_id,
                type: 'io.cozy.sharings'
              }
            }
          ]
        }
      }
    case RECEIVE_NEW_SHARING_LINK:
      return {
        ...state,
        [action.doctype]: {
          ...state[action.doctype],
          byLink: [...state[action.doctype].byLink, action.response]
        }
      }
    case REVOKE_SHARING_LINK:
      idx = state[action.doctype].byLink.findIndex(
        p => action.permission._id === p._id
      )
      if (idx === -1) return state
      return {
        ...state,
        [action.doctype]: {
          ...state[action.doctype],
          byLink: [
            ...state[action.doctype].byLink.slice(0, idx),
            ...state[action.doctype].byLink.slice(idx + 1)
          ]
        }
      }
    default:
      return state
  }
}

export default combineReducers({ documents, permissions })

// actions
export const fetchSharings = (doctype, id = null, options = {}) => ({
  types: [FETCH_SHARINGS, RECEIVE_SHARINGS_DATA, RECEIVE_FETCH_SHARINGS_ERROR],
  doctype,
  id,
  options,
  promise: client => client.fetchSharings(doctype)
})

export const share = (document, recipients, sharingType, sharingDesc) => async (
  dispatch,
  getState
) => {
  const recipientIds = await Promise.all(
    recipients.map(
      recipient =>
        recipient.id ||
        dispatch(createContact(recipient)).then(c => c.data[0].id)
    )
  )
  trackSharingByEmail(document)
  return dispatch(
    createSharing(document, recipientIds, sharingType, sharingDesc)
  )
}

export const unshare = (document, recipient) => async (dispatch, getState) => {
  const sharing = getSharingForRecipient(getState(), document, recipient)
  const loneRecipient = sharing.attributes.recipients.length === 1
  return dispatch({
    types: [REVOKE_SHARING, RECEIVE_SHARING_REVOKE, RECEIVE_ERROR],
    doctype: document._type,
    id: document._id,
    sharingId: sharing.attributes.sharing_id,
    recipientId: recipient._id,
    promise: client =>
      loneRecipient
        ? client.revokeSharing(sharing.attributes.sharing_id)
        : client.revokeSharingForClient(
            sharing.attributes.sharing_id,
            sharing.attributes.recipients.find(
              r => r.recipient.id === recipient._id
            ).Client.client_id
          )
  })
}

export const leave = document => async (dispatch, getState) => {
  const sharings = getDocumentActiveSharings(
    getState(),
    document._type,
    document._id
  )
  const sharing = sharings.find(s => s.attributes.owner === false)
  return dispatch({
    types: [REVOKE_SHARING, RECEIVE_SHARING_REVOKE, RECEIVE_ERROR],
    doctype: document._type,
    id: document._id,
    sharingId: sharing.attributes.sharing_id,
    promise: client => client.revokeSharing(sharing.attributes.sharing_id)
  })
}

export const shareByLink = document => {
  trackSharingByLink(document)
  return createSharingLink(document)
}

export const revokeLink = document => async (dispatch, getState) => {
  const perm = getSharingLinkPermission(
    getState(),
    document._type,
    document._id
  )
  return dispatch({
    types: [REVOKE_SHARING_LINK, RECEIVE_SHARING_LINK_REVOKE, RECEIVE_ERROR],
    doctype: document._type,
    id: document._id,
    permission: perm,
    promise: client => client.revokeSharingLink(perm)
  })
}

const createSharing = (
  document,
  contactIds,
  sharingType = 'master-slave',
  description = ''
) => ({
  types: [CREATE_SHARING, RECEIVE_NEW_SHARING, RECEIVE_ERROR],
  doctype: document._type,
  id: document._id,
  promise: client =>
    client.createSharing(
      getPermissionsFor(document),
      contactIds,
      sharingType,
      description
    )
})

const createSharingLink = document => ({
  types: [CREATE_SHARING_LINK, RECEIVE_NEW_SHARING_LINK, RECEIVE_ERROR],
  doctype: document._type,
  id: document._id,
  promise: client => client.createSharingLink(getPermissionsFor(document, true))
})

// TODO: this is a poor man's migration in order to normalize contacts
// and should be removed after a few weeks in prod
// Note for future-self: If you have no idea of what it means, please, erase this code.
// Note for time-travelers: please travel a little more back in time in order to advise us
// to get contacts right the first time
export const fetchContacts = () => {
  const action = fetchCollection('contacts', 'io.cozy.contacts')
  action.promise = async client => {
    const response = await client.fetchCollection(
      'contacts',
      'io.cozy.contacts'
    )
    const data = await Promise.all(
      response.data.map(contact => {
        return typeof contact.email !== 'string'
          ? contact
          : client
              .updateDocument({
                ...contact,
                email: [
                  {
                    address: contact.email,
                    primary: true
                  }
                ]
              })
              .then(resp => resp.data[0])
      })
    )

    return { ...response, data }
  }
  return action
}

const createContact = ({ email }) =>
  createDocument('io.cozy.contacts', {
    email: [{ address: email, primary: true }]
  })

const getPermissionsFor = (document, publicLink = false) => {
  const { _id, _type } = document
  const verbs = publicLink ? ['GET'] : ['ALL']
  // TODO: this works for albums, but it needs to be generalized and integrated
  // with cozy-client ; some sort of doctype "schema" will be needed here
  return isFile(document)
    ? {
        files: {
          type: 'io.cozy.files',
          verbs,
          values: [_id]
        }
      }
    : {
        collection: {
          type: _type,
          verbs,
          values: [_id]
        },
        files: {
          type: 'io.cozy.files',
          verbs,
          values: [`${_type}/${_id}`],
          selector: 'referenced_by'
        }
      }
}

// selectors
const getSharing = (state, id) =>
  state.cozy.sharings.documents.find(s => s.attributes.sharing_id === id)
const getContact = (state, id) => getDocument(state, 'io.cozy.contacts', id)
const getDoctypePermissions = (state, doctype) => {
  if (state.cozy.sharings.permissions[doctype]) {
    return state.cozy.sharings.permissions[doctype]
  }
  return doctypePermsetInitialState
}

const getSharingLink = (state, doctype, id) => {
  const perm = getSharingLinkPermission(state, doctype, id)
  return perm
    ? buildSharingLink(id, doctype, perm.attributes.codes.email)
    : null
}

const getSharingLinkPermission = (state, doctype, id) => {
  const perms = getDoctypePermissions(state, doctype)
  const type = isFile({ _type: doctype }) ? 'files' : 'collection'
  return perms.byLink.find(
    p => p.attributes.permissions[type].values.indexOf(id) !== -1
  )
}

const getSharingForRecipient = (state, document, recipient) => {
  const sharings = getDocumentActiveSharings(
    state,
    document._type,
    document._id
  )
  return sharings.find(s =>
    s.attributes.recipients.find(r => r.recipient.id === recipient._id)
  )
}

const getDocumentActiveSharings = (state, doctype, id) => {
  const perms = getDoctypePermissions(state, doctype)
  return [
    ...perms.byMe.filter(
      perm => perm.attributes.permissions['rule0'].values.indexOf(id) !== -1
    ),
    ...perms.withMe.filter(
      perm => perm.attributes.permissions['rule0'].values.indexOf(id) !== -1
    )
  ]
    .map(p => getSharing(state, p.attributes.source_id))
    .filter(s => !s.attributes.revoked)
}

export const getSharings = (state, doctype, options = {}) => {
  const perms = getDoctypePermissions(state, doctype)
  const type = doctype === 'io.cozy.files' ? 'files' : 'collection'
  return {
    byMe: perms.byMe.map(p => p.attributes.permissions['rule0'].values[0]),
    withMe: perms.withMe.map(p => p.attributes.permissions['rule0'].values[0]),
    byLink: perms.byLink.map(p => p.attributes.permissions[type].values[0])
  }
}

export const getSharingStatus = (state, doctype, id) => {
  const sharings = getDocumentActiveSharings(state, doctype, id)
  return {
    shared: sharings.length !== 0,
    owner:
      sharings.length === 0 || sharings.some(s => s.attributes.owner === true),
    sharingType: sharings.some(
      s => s.attributes.sharing_type === 'master-master'
    )
      ? 'master-master'
      : 'master-slave',
    sharings
  }
}

export const getSharingDetails = (state, doctype, id, options = {}) => {
  const { shared, owner, sharingType, sharings } = getSharingStatus(
    state,
    doctype,
    id
  )
  const sharingLink = getSharingLink(state, doctype, id)
  return {
    shared,
    owner,
    sharingType,
    sharingLink,
    sharer:
      shared && !owner
        ? { name: 'John Doe', url: sharings[0].attributes.sharer.url }
        : null,
    readOnly: !owner && sharingType === 'master-slave',
    recipients: shared && owner ? getSharingRecipients(state, sharings) : [],
    byMe: shared && owner === true,
    withMe: shared && !owner,
    byLink: !!sharingLink
  }
}

const getSharingRecipients = (state, sharings) =>
  sharings
    .filter(sharing => sharing.attributes.recipients)
    .map(sharing =>
      sharing.attributes.recipients.map(info => ({
        contact: getContact(state, info.recipient.id),
        status: info.status,
        type: sharing.attributes.sharing_type
      }))
    )
    .reduce((a, b) => a.concat(b), [])

const buildSharingLink = (id, doctype, sharecode) =>
  `${window.location.origin}/public?sharecode=${sharecode}&id=${id}${
    doctype === 'file' ? '&directdownload' : ''
  }`

// helpers
const isFile = ({ _type, type }) =>
  _type === 'io.cozy.files' || type === 'directory' || type === 'file'

const track = (document, action) => {
  const tracker = getTracker()
  if (!tracker) {
    return
  }
  tracker.push([
    'trackEvent',
    isFile(document) ? 'Drive' : 'Photos',
    action,
    `${action}${isFile(document) ? 'File' : 'Album'}`
  ])
}
const trackSharingByLink = document => track(document, 'shareByLink')
const trackSharingByEmail = document => track(document, 'shareByEmail')
