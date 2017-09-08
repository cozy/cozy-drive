import { combineReducers } from 'redux'

export const FETCH_SHARINGS = 'FETCH_SHARINGS'
const RECEIVE_SHARINGS_DATA = 'RECEIVE_SHARINGS_DATA'
const RECEIVE_FETCH_SHARINGS_ERROR = 'RECEIVE_FETCH_SHARINGS_ERROR'

const documents = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_SHARINGS_DATA:
      return [...state, ...action.response.sharings]
    default:
      return state
  }
}

const doctypePermsetInitialState = { fetchStatus: 'loading', byMe: [], byLink: [], withMe: [] }

const permissions = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SHARINGS:
      return {...state, [action.doctype]: doctypePermsetInitialState}
    case RECEIVE_SHARINGS_DATA:
      return {...state, [action.doctype]: { fetchStatus: 'loaded', ...action.response.permissions }}
    case RECEIVE_FETCH_SHARINGS_ERROR:
      return {...state, [action.doctype]: { fetchStatus: 'error' }}
    default:
      return state
  }
}

export default combineReducers({ documents, permissions })

export const fetchSharingStatus = (doctype, id) => ({
  types: [FETCH_SHARINGS, RECEIVE_SHARINGS_DATA, RECEIVE_FETCH_SHARINGS_ERROR],
  doctype,
  id,
  promise: (client) => client.fetchSharings(doctype)
})
export const fetchSharings = fetchSharingStatus

const getDoctypePermissions = (state, doctype) => {
  if (state.cozy.sharings.permissions[doctype]) {
    return state.cozy.sharings.permissions[doctype]
  }
  console.warn('It looks like you\'re using sharings selectors without fetching the corresponding doctype\'s sharing permissions')
  return doctypePermsetInitialState
}

const getSharing = (state, id) => state.cozy.sharings.documents.find(s => s.attributes.sharing_id === id)

export const getSharingDetails = (state, doc) => {
  const perms = getDoctypePermissions(state, doc._type)
  const byMe = perms.byMe.find(p => p.attributes.permissions['rule0'].values.indexOf(doc._id) !== -1)
  const withMe = perms.withMe.find(p => p.attributes.permissions['rule0'].values.indexOf(doc._id) !== -1)
  const byLink = perms.byLink.find(p => p.attributes.permissions['collection'].values.indexOf(doc._id) !== -1)
  const sharer = withMe !== undefined
    ? {
      name: 'John Doe',
      url: getSharing(state, withMe.attributes.source_id).attributes.sharer.url,
      createdAt: doc.created_at || null,
      sharingType: getSharing(state, withMe.attributes.source_id).attributes.sharing_type
    }
    : 'me'
  return {
    byMe: byMe !== undefined,
    byLink: byLink !== undefined,
    withMe: withMe !== undefined,
    sharer
  }
}

export const isSharedByMe = (state, doc) =>
  getDoctypePermissions(state, doc._type).byMe.find(p => p.attributes.permissions['rule0'].values.indexOf(doc._id) !== -1) !== undefined

export const isSharedWithMe = (state, doc) =>
  getDoctypePermissions(state, doc._type).withMe.find(p => p.attributes.permissions['rule0'].values.indexOf(doc._id) !== -1) !== undefined

export const isSharedByLink = (state, doc) =>
  getDoctypePermissions(state, doc._type).byLink.find(p => p.attributes.permissions['collection'].values.indexOf(doc._id) !== -1) !== undefined
