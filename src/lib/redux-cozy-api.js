/* global cozy */
import { combineReducers } from 'redux'

// action types
const REGISTER_SCHEMAS = 'REGISTER_SCHEMAS'
const GET_OR_CREATE_INDEX = 'GET_OR_CREATE_INDEX'
const FETCH_DOCUMENTS = 'FETCH_DOCUMENTS'
const RECEIVE_DATA = 'RECEIVE_DATA'
const RECEIVE_ERROR = 'RECEIVE_ERROR'

// reducers
const schemas = (state = {}, action) => {
  switch (action.type) {
    case REGISTER_SCHEMAS:
      return Object.assign({}, state, action.schemas)
    case GET_OR_CREATE_INDEX:
      return {
        ...state,
        [action.doctype]: Object.assign({}, state[action.doctype], { index: action.index })
      }
    default:
      return state
  }
}

const entities = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return {
        ...state,
        [action.doctype]: Object.assign({}, state[action.doctype], objectifyEntitiesArray(action.response.data))
      }
    default:
      return state
  }
}

// endpoint reducers
const type = (state = null, action) => {
  switch (action.type) {
    case FETCH_DOCUMENTS:
      return action.doctype
    default:
      return state
  }
}

const fetchStatus = (state = 'pending', action) => {
  switch (action.type) {
    case FETCH_DOCUMENTS:
      return 'loading'
    case RECEIVE_DATA:
      return 'loaded'
    case RECEIVE_ERROR:
      return 'failed'
    default:
      return state
  }
}

const lastFetch = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return Date.now()
    default:
      return state
  }
}

const hasMore = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return action.next !== undefined ? action.next : state
    default:
      return state
  }
}

const count = (state = 0, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      const response = action.response
      return response.meta && response.meta.count ? response.meta.count : response.data.length
    default:
      return state
  }
}

const ids = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      return [
        ...state,
        ...action.response.data.map(doc => doc.id)
      ]
    default:
      return state
  }
}

const endpoint = combineReducers({
  type,
  fetchStatus,
  lastFetch,
  hasMore,
  count,
  ids
})

const endpoints = (state = {}, action) => {
  switch (action.type) {
    case FETCH_DOCUMENTS:
    case RECEIVE_DATA:
    case RECEIVE_ERROR:
      const endpointKey = action.doctype
      return Object.assign({}, state, { [endpointKey]: endpoint(state[endpointKey] || {}, action) })
    default:
      return state
  }
}

export default combineReducers({
  schemas,
  entities,
  endpoints
})

// utils
const objectifyEntitiesArray = (entities) => {
  let obj = {}
  entities.forEach(entity => obj[entity.id] = entity)
  return obj
}

const mapEntitiesToIds = (entities, doctype, ids) => {
  return ids.map(id => entities[doctype][id])
}

// selectors
const getSchema = (state, doctype) => state.api.schemas[doctype]
const getIndex = (state, doctype) => getSchema(state, doctype).index

export const getEntities = (state, doctype, ids) => mapEntitiesToIds(state.api.entities, doctype, ids)

export const getEntityList = (state, doctype) => getEndpointList(state, doctype)

export const getEndpointList = (state, key) => {
  const list = state.api.endpoints[key]
  if (list !== undefined) {
    // TODO: replace entries by entities when withList() HOC is available
    return Object.assign({}, list, { entries: getEntities(state, list.type, list.ids) })
  }
  return list
}

// action creators
export const registerSchemas = (schemas) => (dispatch) => {
  dispatch({ type: REGISTER_SCHEMAS, schemas })
}

const getOrCreateIndex = (doctype) => async (dispatch, getState) => {
  let index = getIndex(getState(), doctype)
  if (!index) {
    const { fields } = getSchema(getState(), doctype)
    index = await cozy.client.data.defineIndex(doctype, fields)
    dispatch({ type: GET_OR_CREATE_INDEX, doctype, index })
  }
  return index
}

export const fetchDocuments = (doctype) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_DOCUMENTS, doctype })
    // WARN: cozy-client-js lacks a cozy.data.findAll method that uses this route
    const resp = await cozy.client.fetchJSON('GET', `/data/${doctype}/_all_docs?include_docs=true`)
    // WARN: the JSON response from the stack is not homogenous with other routes (offset? rows? total_rows?)
    // see https://github.com/cozy/cozy-stack/blob/master/docs/data-system.md#list-all-the-documents
    // WARN: looks like this route returns something looking like a couchDB design doc, we need to filter it:
    const rows = resp.rows.filter(row => !row.doc.hasOwnProperty('views'))
    // we forge a correct JSONAPI response:
    const docs = rows.map(row => Object.assign({}, row.doc, { id: row.id, type: doctype }))
    const JSONAPIresp = {
      data: docs,
      meta: { count: resp.total_rows },
      skip: resp.offset,
      next: false
    }
    dispatch({ type: RECEIVE_DATA, doctype, response: JSONAPIresp })
  } catch (error) {
    dispatch({ type: RECEIVE_ERROR, doctype, error })
  }
}
