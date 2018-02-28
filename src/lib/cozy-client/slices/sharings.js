import { combineReducers } from 'redux'
import { getTracker } from 'cozy-ui/react/helpers/tracker'
import { SHARINGS_DOCTYPE } from '../collections/SharingsCollection'
import { APPS_DOCTYPE } from '../collections/AppsCollection'
import {
  getDocument,
  createDocument,
  fetchCollection,
  makeFetchCollection,
  getCollection
} from '../reducer'

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
  fetchStatus: 'pending',
  byMe: [],
  byLink: [],
  withMe: []
}

const doctypePermissions = (state = doctypePermsetInitialState, action) => {
  switch (action.type) {
    case FETCH_SHARINGS:
      return { ...state, fetchStatus: 'loading' }
    case RECEIVE_SHARINGS_DATA:
      return {
        fetchStatus: 'loaded',
        ...action.response.permissions
      }
    case RECEIVE_FETCH_SHARINGS_ERROR:
      return { ...state, fetchStatus: 'error' }
    case RECEIVE_NEW_SHARING:
      return {
        ...state,
        byMe: [
          ...state.byMe,
          {
            attributes: {
              permissions: {
                files: { type: action.doctype, values: [action.id] }
              },
              source_id: action.response.attributes.sharing_id,
              type: 'io.cozy.sharings'
            }
          }
        ]
      }
    case RECEIVE_NEW_SHARING_LINK:
      return {
        ...state,
        byLink: [...state.byLink, action.response]
      }
    case REVOKE_SHARING_LINK:
      const permIds = action.permissions.map(p => p._id)
      return {
        ...state,
        byLink: state.byLink.filter(p => permIds.indexOf(p._id) === -1)
      }
    default:
      return state
  }
}

const permissions = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SHARINGS:
    case RECEIVE_SHARINGS_DATA:
    case RECEIVE_FETCH_SHARINGS_ERROR:
    case RECEIVE_NEW_SHARING:
    case RECEIVE_NEW_SHARING_LINK:
    case REVOKE_SHARING_LINK:
      if (!action.doctype) {
        return state
      }
      return {
        ...state,
        [action.doctype]: doctypePermissions(state[action.doctype], action)
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
  promise: client =>
    client.getCollection(SHARINGS_DOCTYPE).findByDoctype(doctype),
  dependencies: [fetchApps()]
})

export const share = (document, recipients, sharingType, sharingDesc) => async (
  dispatch,
  getState
) => {
  const recipientIds = await Promise.all(
    recipients.map(
      recipient =>
        recipient.id ||
        dispatch(createContact(recipient))
          .then(response => response.data[0])
          .then(contact => contact.id)
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
        ? client
            .getCollection(SHARINGS_DOCTYPE)
            .revoke(sharing.attributes.sharing_id)
        : client
            .getCollection(SHARINGS_DOCTYPE)
            .revokeForClient(
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
    promise: client =>
      client
        .getCollection(SHARINGS_DOCTYPE)
        .revoke(sharing.attributes.sharing_id)
  })
}

export const shareByLink = document => {
  trackSharingByLink(document)
  return createSharingLink(document)
}

export const revokeLink = document => async (dispatch, getState) => {
  // Because some duplicate links have been created in the past, we must ensure
  // we revoke all of them
  const perms = getSharingLinkPermissions(
    getState(),
    document._type,
    document._id
  )
  return dispatch({
    types: [REVOKE_SHARING_LINK, RECEIVE_SHARING_LINK_REVOKE, RECEIVE_ERROR],
    doctype: document._type,
    id: document._id,
    permissions: perms,
    promise: client => client.getCollection(SHARINGS_DOCTYPE).revokeLink(perms)
  })
}

const createSharing = (
  document,
  contactIds,
  sharingType = 'two-way',
  description = ''
) => ({
  types: [CREATE_SHARING, RECEIVE_NEW_SHARING, RECEIVE_ERROR],
  doctype: document._type,
  id: document._id,
  promise: client =>
    client
      .getCollection(SHARINGS_DOCTYPE)
      .create(getPermissionsFor(document), contactIds, sharingType, description)
})

const createSharingLink = document => ({
  types: [CREATE_SHARING_LINK, RECEIVE_NEW_SHARING_LINK, RECEIVE_ERROR],
  doctype: document._type,
  id: document._id,
  promise: client =>
    client
      .getCollection(SHARINGS_DOCTYPE)
      .createLink(getPermissionsFor(document, true))
})

export const fetchApps = () =>
  makeFetchCollection('apps', APPS_DOCTYPE, client =>
    client.getCollection(APPS_DOCTYPE).all()
  )

const getApps = state => getCollection(state, 'apps').data

const getAppUrl = (state, appName) => {
  const apps = getApps(state)
  const app = apps.find(
    a => a.attributes.slug === appName && a.attributes.state === 'ready'
  )
  if (!app) {
    throw new Error(`Sharing link: app ${appName} not installed`)
  }
  return app.links.related
}

// TODO: this is a poor man's migration in order to normalize contacts
// and should be removed after a few weeks in prod
// Note for future-self: If you have no idea of what it means, please, erase this code.
// Note for time-travelers: please travel a little more back in time in order to advise us
// to get contacts right the first time
export const fetchContacts = () => {
  const action = fetchCollection('contacts', 'io.cozy.contacts')
  action.promise = async client => {
    const response = await client.fetchDocuments('contacts', 'io.cozy.contacts')
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
  state.cozy.sharings.documents.find(
    s => s.attributes && s.attributes.sharing_id === id
  )
const getContact = (state, id) => getDocument(state, 'io.cozy.contacts', id)

const getDoctypePermissions = (state, doctype) =>
  state.cozy.sharings.permissions[doctype]
    ? state.cozy.sharings.permissions[doctype]
    : doctypePermsetInitialState

export const getSharingLink = (state, doctype, id) => {
  const perm = getSharingLinkPermission(state, doctype, id)
  return perm &&
    perm.attributes &&
    perm.attributes.codes &&
    perm.attributes.codes.email
    ? buildSharingLink(state, id, doctype, perm.attributes.codes.email)
    : null
}

const getSharingLinkPermission = (state, doctype, id) => {
  const perms = getSharingLinkPermissions(state, doctype, id)
  return perms.length === 0 ? null : perms[0]
}

// This shouldn't have happened, but unfortunately some duplicate sharing links have been created in the past
const getSharingLinkPermissions = (state, doctype, id) => {
  const perms = getDoctypePermissions(state, doctype)
  const type = isFile({ _type: doctype }) ? 'files' : 'collection'
  return perms.byLink.filter(
    p =>
      p.attributes &&
      p.attributes.permissions &&
      p.attributes.permissions[type] &&
      p.attributes.permissions[type].values.indexOf(id) !== -1
  )
}

const getSharingForRecipient = (state, document, recipient) => {
  const sharings = getDocumentActiveSharings(
    state,
    document._type,
    document._id
  )
  return sharings.find(
    s =>
      s.attributes &&
      s.attributes.recipients &&
      s.attributes.recipients.find(
        r => r.recipient && r.recipient.id === recipient._id
      )
  )
}

const getDocumentActiveSharings = (state, doctype, id) => {
  const perms = getDoctypePermissions(state, doctype)
  return [
    ...perms.byMe.filter(
      perm => perm.attributes.permissions.files.values.indexOf(id) !== -1
    ),
    ...perms.withMe.filter(
      perm => perm.attributes.permissions.rule0.values.indexOf(id) !== -1
    )
  ]
    .map(p => getSharing(state, p.attributes.source_id))
    .filter(s => s && s.attributes && !s.attributes.revoked)
}

export const getSharings = (state, doctype, options = {}) => {
  const perms = getDoctypePermissions(state, doctype)
  const type = doctype === 'io.cozy.files' ? 'files' : 'collection'
  return {
    byMe: perms.byMe.map(p => p.attributes.permissions.files.values[0]),
    withMe: perms.withMe.map(p => p.attributes.permissions.rule0.values[0]),
    byLink: perms.byLink.map(p => p.attributes.permissions[type].values[0])
  }
}

export const getSharingStatus = (state, doctype, id) => {
  const sharings = getDocumentActiveSharings(state, doctype, id)
  return {
    shared: sharings.length !== 0,
    owner:
      sharings.length === 0 || sharings.some(s => s.attributes.owner === true),
    sharingType: sharings.some(s => s.attributes.sharing_type === 'two-way')
      ? 'two-way'
      : 'one-way',
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
    readOnly: !owner && sharingType === 'one-way',
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

const getAppUrlForDoctype = (state, doctype) => {
  switch (doctype) {
    case 'io.cozy.files':
      return getAppUrl(state, 'drive')
    case 'io.cozy.photos.albums':
      return getAppUrl(state, 'photos')
    default:
      throw new Error(
        `Sharing link: don't know which app to use for doctype ${doctype}`
      )
  }
}

const buildSharingLink = (state, id, doctype, sharecode) => {
  const appUrl = getAppUrlForDoctype(state, doctype)
  return `${appUrl}public?sharecode=${sharecode}&id=${id}`
}

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
