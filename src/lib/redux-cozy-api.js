/* global cozy */
import { combineReducers } from 'redux'

const FILES_DOCTYPE = 'io.cozy.files'
const FETCH_LIMIT = 10

// action types
const REGISTER_SCHEMAS = 'REGISTER_SCHEMAS'
const GET_OR_CREATE_INDEX = 'GET_OR_CREATE_INDEX'
const FETCH_DOCUMENTS = 'FETCH_DOCUMENTS'
const FETCH_DOCUMENT = 'FETCH_DOCUMENT'
const FETCH_REFERENCED_FILES = 'FETCH_REFERENCED_FILES'
const CREATE_ENTITY = 'CREATE_ENTITY'
const RECEIVE_DATA = 'RECEIVE_DATA'
const RECEIVE_REFERENCED_FILES = 'RECEIVE_REFERENCED_FILES'
const RECEIVE_CREATION_CONFIRM = 'RECEIVE_CREATION_CONFIRM'
const RECEIVE_ERROR = 'RECEIVE_ERROR'
const RECEIVE_CREATION_ERROR = 'RECEIVE_CREATION_ERROR'

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
    case RECEIVE_REFERENCED_FILES:
      return {
        ...state,
        [FILES_DOCTYPE]: Object.assign({}, state[FILES_DOCTYPE], objectifyEntitiesArray(action.response.data))
      }
    case RECEIVE_CREATION_CONFIRM:
      return {
        ...state,
        [action.entity.type]: Object.assign({}, state[action.entity.type], objectifyEntitiesArray(action.response.data))
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
    case FETCH_REFERENCED_FILES:
      return FILES_DOCTYPE
    default:
      return state
  }
}

const fetchStatus = (state = 'pending', action) => {
  switch (action.type) {
    case FETCH_DOCUMENTS:
    case FETCH_REFERENCED_FILES:
      return action.skip > 0 ? 'loadingMore' : 'loading'
    case RECEIVE_DATA:
    case RECEIVE_REFERENCED_FILES:
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
    case RECEIVE_REFERENCED_FILES:
      return Date.now()
    default:
      return state
  }
}

const hasMore = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
    case RECEIVE_REFERENCED_FILES:
      const response = action.response
      return response.next !== undefined ? response.next : state
    default:
      return state
  }
}

const count = (state = 0, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
    case RECEIVE_REFERENCED_FILES:
      const response = action.response
      return response.meta && response.meta.count ? response.meta.count : response.data.length
    default:
      return state
  }
}

const ids = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_DATA:
    case RECEIVE_REFERENCED_FILES:
      if (!action.skip) {
        return action.response.data.map(doc => doc.id)
      }
      return [
        ...state,
        ...action.response.data.map(doc => doc.id)
      ]
    case RECEIVE_CREATION_CONFIRM:
      return [
        ...state,
        action.response.data[0].id
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
    case FETCH_REFERENCED_FILES:
    case RECEIVE_DATA:
    case RECEIVE_REFERENCED_FILES:
    case RECEIVE_CREATION_CONFIRM:
    case RECEIVE_ERROR:
      const entity = action.entity
      const endpointKey = entity
        ? (action.relationName ? `${entity.type}/${entity.id}/${action.relationName}` : `${entity.type}`)
        : action.doctype
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
  if (!entities[doctype]) {
    return ids.map(() => null)
  }
  return ids.map(id => entities[doctype][id])
}

// selectors
const getSchema = (state, doctype) => state.api.schemas[doctype]
const getRelations = (state, doctype) => getSchema(state, doctype).relations || {}
const getIndex = (state, doctype) => getSchema(state, doctype).index

export const getEntity = (state, doctype, id) => getEntities(state, doctype, [id])[0]

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

export const getReferencedFilesList = (state, doctype, id, relationName) => getEndpointList(state, `${doctype}/${id}/${relationName}`)

// async helpers: they interact with the stack but not with the store

// TODO: for this first helper, sadly, we need to make it an action creator
// because we need the store's state in order to retrieve the mango index
// that's another proof that indexes should be managed by cozy-client-js...
export const checkUniquenessOf = (doctype, property, value) => async (dispatch, getState) => {
  const index = await dispatch(getOrCreateIndex(doctype))
  const existingDocs = await cozy.client.data.query(index, {
    selector: { [property]: value },
    fields: ['_id']
  })
  return existingDocs.length === 0
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
    // we normalize the data (note that we add _type so that cozy.client.data.listReferencedFiles works...)
    const docs = rows.map(row => Object.assign({}, row.doc, { id: row.id, type: doctype, _type: doctype }))
    // if the doctype references files, we fetch these files IDs here (this is needed for albums)
    // in the future, if we define more complex relations with other doctypes, we may have to deal
    // with the retrieval of these association IDs here
    const relations = getRelations(getState(), doctype)
    for (let name in relations) {
      if (relations[name].type === FILES_DOCTYPE) {
        for (let doc of docs) {
          doc[name] = await cozy.client.data.listReferencedFiles(doc)
        }
      }
    }
    // we forge a correct JSONAPI response:
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

const getOrFetchDocument = (doctype, id) => async (dispatch, getState) => {
  let doc = getEntity(getState(), doctype, id)
  if (!doc) {
    // TODO: handle fetch status & errors with specific reducers:
    // { entities: 'io.cozy.photos.albums': { entities: {...}, fetchStatuses: {...}, errors: {...} }}
    dispatch({ type: FETCH_DOCUMENT, doctype, id })
    doc = await cozy.client.data.find(doctype, id)
    // we normalize again...
    doc = Object.assign({}, doc, { id: doc._id, type: doc._type })
  }
  return doc
}

export const fetchDocument = (doctype, id, options) => async (dispatch, getState) => {
  try {
    const doc = await dispatch(getOrFetchDocument(doctype, id))
    if (options.include) {
      const relations = getRelations(getState(), doctype)
      for (let relationName of options.include) {
        const relationType = relations[relationName].type
        // TODO: we only handle files relations here
        if (relationType === FILES_DOCTYPE) {
          dispatch(fetchReferencedFiles(doc, relationName))
        }
      }
    }
  } catch (error) {
    dispatch({ type: RECEIVE_ERROR, doctype, id, error })
  }
}

export const fetchReferencedFiles = (entity, relationName, skip = 0) => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_REFERENCED_FILES, entity, relationName, skip })
    // WARN: the stack API is probably not ideal here: referencedFiles are in the 'included' property
    // (that should be used when fetching an entity AND its relations) and the 'data' property
    // only contains uplets { id, type }
    const { included, meta } = await cozy.client.data.fetchReferencedFiles(entity, { skip, limit: FETCH_LIMIT })
    // we forge a standard response with a 'data' property
    const response = {
      data: included.map(file => Object.assign({}, file.attributes, { id: file.id, _id: file.id, links: file.links })),
      meta,
      next: meta.count > skip + FETCH_LIMIT
    }
    dispatch({ type: RECEIVE_REFERENCED_FILES, entity, relationName, response, skip })
  } catch (error) {
    dispatch({ type: RECEIVE_ERROR, entity, relationName, error })
  }
}

export const createEntity = (entity) => async (dispatch, getState) => {
  try {
    // TODO: handle this action type
    dispatch({ type: CREATE_ENTITY, entity })
    const relations = getRelations(getState(), entity.type)
    const created = await cozy.client.data.create(entity.type, entity)
    // Let's handle the entity's relations
    for (let relationName in relations) {
      const relationType = relations[relationName].type
      // TODO: we only handle files relations here
      if (relationType === FILES_DOCTYPE) {
        await cozy.client.data.addReferencedFiles(created, entity[relationName])
      }
    }
    // we forge a standard response with a 'data' property
    const normalizedEntity = Object.assign({}, created, { id: created._id })
    const response = { data: [normalizedEntity] }
    dispatch({ type: RECEIVE_CREATION_CONFIRM, entity: created, response })
    return normalizedEntity
  } catch (error) {
    dispatch({ type: RECEIVE_CREATION_ERROR, entity, error })
    throw error
  }
}
