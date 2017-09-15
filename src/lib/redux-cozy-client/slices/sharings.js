import { combineReducers } from 'redux'
import { getTracker } from 'cozy-ui/react/helpers/tracker'
import { getDocument, isCollectionFetched, createDocument } from '../reducer'

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

const documents = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SHARINGS_DATA:
      return [...state, ...action.response.sharings]
    case RECEIVE_NEW_SHARING:
      return [...state, action.response]
    case REVOKE_SHARING:
      const idx = state.findIndex(s => s.attributes.sharing_id === action.sharingId)
      if (idx === -1) return state
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    default:
      return state
  }
}

const doctypePermsetInitialState = { fetchStatus: 'loading', byMe: [], byLink: [], withMe: [] }

const permissions = (state = {}, action) => {
  let idx
  switch (action.type) {
    case FETCH_SHARINGS:
      return {...state, [action.doctype]: doctypePermsetInitialState}
    case RECEIVE_SHARINGS_DATA:
      return {...state, [action.doctype]: { fetchStatus: 'loaded', ...action.response.permissions }}
    case RECEIVE_FETCH_SHARINGS_ERROR:
      return {...state, [action.doctype]: { fetchStatus: 'error' }}
    case RECEIVE_NEW_SHARING:
      return {
        ...state,
        [action.doctype]: {
          ...state[action.doctype],
          byMe: [
            ...state[action.doctype].byMe,
            {
              attributes: {
                permissions: { 'rule0': { type: action.doctype, values: [action.id] } },
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
          byLink: [
            ...state[action.doctype].byLink,
            action.response
          ]
        }
      }
    case REVOKE_SHARING_LINK:
      idx = state[action.doctype].byLink.findIndex(p => action.permission._id === p._id)
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
    case REVOKE_SHARING:
      idx = state[action.doctype].byMe.findIndex(p => action.permission._id === p._id)
      if (idx === -1) return state
      return {
        ...state,
        [action.doctype]: {
          ...state[action.doctype],
          byMe: [
            ...state[action.doctype].byMe.slice(0, idx),
            ...state[action.doctype].byMe.slice(idx + 1)
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
  promise: (client) => client.fetchSharings(doctype)
})

export const share = (document, recipient, sharingType, sharingDesc) => async (dispatch, getState) => {
  const recipientId = recipient.id || (await dispatch(createContact(recipient))).data[0].id
  trackSharingByEmail(document)
  return dispatch(createSharing(document, recipientId, sharingType, sharingDesc))
}

export const unshare = (document, recipient) => async (dispatch, getState) => {
  const perm = getSharingPermission(getState(), document)
  console.log(perm)
  return dispatch({
    types: [REVOKE_SHARING, RECEIVE_SHARING_REVOKE, RECEIVE_ERROR],
    doctype: document._type,
    id: document._id,
    permission: perm,
    sharingId: perm.attributes.source_id,
    // TODO: right now, we create one sharing for each recipient, so we can just
    // delete the sharing, but when we'll have many recipients for one sharing,
    // we'll need to use another route:
    // https://github.com/cozy/cozy-stack/blob/master/docs/sharing.md#delete-sharingssharing-idrecipientclient-id
    promise: client => client.revokeSharing(perm.attributes.source_id)
  })
}

export const shareByLink = (document) => {
  trackSharingByLink(document)
  return createSharingLink(document)
}

export const revokeLink = (document) => async (dispatch, getState) => {
  const perm = getSharingLinkPermission(getState(), document)
  return dispatch({
    types: [REVOKE_SHARING_LINK, RECEIVE_SHARING_LINK_REVOKE, RECEIVE_ERROR],
    doctype: document._type,
    id: document._id,
    permission: perm,
    promise: client => client.revokeSharingLink(perm)
  })
}

const createSharing = (document, contactId, sharingType = 'master-slave', description = '') => ({
  types: [CREATE_SHARING, RECEIVE_NEW_SHARING, RECEIVE_ERROR],
  doctype: document._type,
  id: document._id,
  promise: client => client.createSharing(getPermissionsFor(document), contactId, sharingType, description)
})

const createSharingLink = (document) => ({
  types: [CREATE_SHARING_LINK, RECEIVE_NEW_SHARING_LINK, RECEIVE_ERROR],
  doctype: document._type,
  id: document._id,
  promise: client => client.createSharingLink(getPermissionsFor(document, true))
})

const createContact = ({ email }) => createDocument({
  type: 'io.cozy.contacts',
  email: [{ address: email, primary: true }]
})

const getPermissionsFor = (document, publicLink = false) => {
  const { _id, _type } = document
  const verbs = publicLink ? ['GET'] : ['ALL']
  return isFile(document)
    ? {
      files: {
        type: 'io.cozy.files',
        verbs,
        values: [_id]
      }
    }
    // TODO: this works for albums, but it needs to be generalized and integrated
    // with redux-cozy-client ; some sort of doctype "schema" will be needed here
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
const getSharing = (state, id) => state.cozy.sharings.documents.find(s => s.attributes.sharing_id === id)
const getContact = (state, id) => getDocument(state, 'io.cozy.contacts', id)
const getDoctypePermissions = (state, doctype) => {
  if (state.cozy.sharings.permissions[doctype]) {
    return state.cozy.sharings.permissions[doctype]
  }
  return doctypePermsetInitialState
}

const getSharingLinkPermission = (state, document) => {
  const perms = getDoctypePermissions(state, document._type)
  return perms.byLink.find(p => p.attributes.permissions[isFile(document) ? 'files' : 'collection'].values.indexOf(document._id) !== -1)
}

const getSharingPermission = (state, document) => {
  const perms = getDoctypePermissions(state, document._type)
  return perms.byMe.find(p => p.attributes.permissions['rule0'].values.indexOf(document._id) !== -1)
}

export const getSharings = (state, doctype, options = {}) => {
  const perms = getDoctypePermissions(state, doctype)
  return {
    byMe: perms.byMe.map(p => p.attributes.permissions['rule0'].values[0]),
    withMe: perms.withMe.map(p => p.attributes.permissions['rule0'].values[0]),
    byLink: perms.byLink.map(p => p.attributes.permissions[doctype === 'io.cozy.files' ? 'files' : 'collection'].values[0])
  }
}

export const getSharingDetails = (state, doctype, id, options = {}) => {
  const perms = getDoctypePermissions(state, doctype)
  const byMe = perms.byMe.find(p => p.attributes.permissions['rule0'].values.indexOf(id) !== -1)
  const withMe = perms.withMe.find(p => p.attributes.permissions['rule0'].values.indexOf(id) !== -1)
  const byLink = perms.byLink.find(p => p.attributes.permissions[doctype === 'io.cozy.files' ? 'files' : 'collection'].values.indexOf(id) !== -1)
  const sharer = withMe !== undefined
    ? {
      name: 'John Doe',
      url: getSharing(state, withMe.attributes.source_id).attributes.sharer.url
    }
    : 'me'
  const sharingType = byMe !== undefined
    ? getSharing(state, byMe.attributes.source_id).attributes.sharing_type
    : (
      withMe !== undefined
      ? getSharing(state, withMe.attributes.source_id).attributes.sharing_type
      : null
    )
  const resp = {
    byMe: byMe !== undefined,
    byLink: byLink !== undefined,
    withMe: withMe !== undefined,
    readOnly: withMe !== undefined && sharingType === 'master-slave',
    sharingType,
    sharingLink: byLink !== undefined ? buildSharingLink(id, doctype, byLink.attributes.codes.email) : null,
    sharer
  }
  // TODO: the isCollectionFetched condition is temporary, and is fragile because we have to use the collection
  // name instead of its doctype...
  if (options.include && options.include.indexOf('recipients') !== -1 && isCollectionFetched(state, 'contacts')) {
    resp.recipients = getSharingRecipients(state, doctype, id)
  }
  return resp
}

const getSharingRecipients = (state, doctype, id) => {
  const perms = getDoctypePermissions(state, doctype)
  return perms.byMe.filter(perm => perm.attributes.permissions['rule0'].values.indexOf(id) !== -1)
      .map(perm => getSharing(state, perm.attributes.source_id))
      .map(sharing =>
        sharing.attributes.recipients.map(info =>
          ({
            contact: getContact(state, info.recipient.id),
            status: info.status,
            type: sharing.attributes.sharing_type
          })
        )
      )
      .reduce((a, b) => a.concat(b), [])
}

const buildSharingLink = (id, doctype, sharecode) =>
  `${window.location.origin}/public?sharecode=${sharecode}&id=${id}${doctype === 'file' ? '&directdownload' : ''}`

// helpers
const isFile = ({ _type, type }) => _type === 'io.cozy.files' || type === 'directory' || type === 'file'

const track = (document, action) => {
  const tracker = getTracker()
  if (!tracker) {
    return
  }
  tracker.push(['trackEvent', isFile(document) ? 'Drive' : 'Photos', action, `${action}${isFile(document) ? 'File' : 'Album'}`])
}
const trackSharingByLink = (document) => track(document, 'shareByLink')
const trackSharingByEmail = (document) => track(document, 'shareByEmail')
