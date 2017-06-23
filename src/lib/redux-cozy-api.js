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
const ADD_REFERENCED_FILES = 'ADD_REFERENCED_FILES'
const REMOVE_REFERENCED_FILES = 'REMOVE_REFERENCED_FILES'
const CREATE_ENTITY = 'CREATE_ENTITY'
const UPDATE_ENTITY = 'UPDATE_ENTITY'
const DELETE_ENTITY = 'DELETE_ENTITY'
const RECEIVE_DATA = 'RECEIVE_DATA'
const RECEIVE_DOCUMENT = 'RECEIVE_DOCUMENT'
const RECEIVE_REFERENCED_FILES = 'RECEIVE_REFERENCED_FILES'
const RECEIVE_CREATION_CONFIRM = 'RECEIVE_CREATION_CONFIRM'
const RECEIVE_UPDATE_CONFIRM = 'RECEIVE_UPDATE_CONFIRM'
const RECEIVE_DELETION_CONFIRM = 'RECEIVE_DELETION_CONFIRM'
const RECEIVE_ERROR = 'RECEIVE_ERROR'
const RECEIVE_CREATION_ERROR = 'RECEIVE_CREATION_ERROR'
const RECEIVE_UPDATE_ERROR = 'RECEIVE_UPDATE_ERROR'
const RECEIVE_DELETION_ERROR = 'RECEIVE_DELETION_ERROR'

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
    case ADD_REFERENCED_FILES:
      return {
        ...state,
        [action.entity.type]: Object.assign({}, state[action.entity.type], { [action.entity.id]: action.entity })
      }
    case REMOVE_REFERENCED_FILES:
      const entity = state[action.entity.type][action.entity.id]
      if (!entity) {
        return state // nothing to update
      }
      const updated = Object.assign({}, entity, { [action.relationName]: entity[action.relationName].filter(id => action.ids.indexOf(id) === -1) })
      return {
        ...state,
        [action.entity.type]: Object.assign({}, state[action.entity.type], { [action.entity.id]: updated })
      }
    case RECEIVE_DOCUMENT:
    case RECEIVE_CREATION_CONFIRM:
    case RECEIVE_UPDATE_CONFIRM:
      return {
        ...state,
        [action.entity.type]: Object.assign({}, state[action.entity.type], objectifyEntitiesArray(action.response.data))
      }
    case RECEIVE_DELETION_CONFIRM:
      return {
        ...state,
        [action.entity.type]: removeObjectProperty(state[action.entity.type], action.entity.id)
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
    case ADD_REFERENCED_FILES:
      return state + action.ids.length
    case REMOVE_REFERENCED_FILES:
      return state - action.ids.length
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
    case ADD_REFERENCED_FILES:
      // TODO: here we don't follow JSONAPI conventions... (we pass an array of ids in the action)
      return [
        ...state,
        ...action.ids
      ]
    case REMOVE_REFERENCED_FILES:
      return state.filter(id => action.ids.indexOf(id) === -1)
    case RECEIVE_CREATION_CONFIRM:
      return [
        ...state,
        action.response.data[0].id
      ]
    case RECEIVE_DELETION_CONFIRM:
      return state.filter(id => id !== action.response.data[0].id)
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
    case ADD_REFERENCED_FILES:
    case REMOVE_REFERENCED_FILES:
    case RECEIVE_CREATION_CONFIRM:
    case RECEIVE_DELETION_CONFIRM:
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
const removeObjectProperty = (obj, prop) => {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== prop) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

const objectifyEntitiesArray = (entities) => {
  let obj = {}
  entities.forEach(entity => { obj[entity.id] = entity })
  return obj
}

const mapEntitiesToIds = (entities, doctype, ids) => {
  if (!entities[doctype]) {
    return ids.map(() => null)
  }
  return ids.map(id => entities[doctype][id])
}

const slugify = (text) =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text

const forceFileDownload = (href, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// selectors
const getSchema = (state, doctype) => state.api.schemas[doctype]
const getRelations = (state, doctype) => getSchema(state, doctype).relations || {}
const getIndex = (state, doctype) => getSchema(state, doctype).index

export const getEntity = (state, doctype, id) => !state.api.entities[doctype] ? null : state.api.entities[doctype][id]

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
export const downloadArchive = async (notSecureFilename, fileIds) => {
  const filename = slugify(notSecureFilename)
  const href = await cozy.client.files.getArchiveLinkByIds(fileIds, filename)
  const fullpath = await cozy.client.fullpath(href)
  forceFileDownload(fullpath, filename + '.zip')
}

// TODO: for this helper, sadly, we need to make it an action creator
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
    dispatch({ type: RECEIVE_DOCUMENT, entity: doc, response: { data: [doc] } })
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
    // TODO: this error is badly handled by the reducers
    // it's only handled by the endpoint reducer, but we'd like to handle it in a per-entity
    // reducer in the future. That's why we re-throw for now
    dispatch({ type: RECEIVE_ERROR, doctype, id, error })
    throw error
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
      data: !included ? [] : included.map(file => Object.assign({}, file.attributes, { id: file.id, _id: file.id, links: file.links })),
      meta,
      next: meta.count > skip + FETCH_LIMIT
    }
    dispatch({ type: RECEIVE_REFERENCED_FILES, entity, relationName, response, skip })
  } catch (error) {
    dispatch({ type: RECEIVE_ERROR, entity, relationName, error })
    console.log(error)
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
        // WARN: we don't use the addReferencedFiles action creator here
        // because the entity should already have a property named after the
        // relation's name containing IDs
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

export const addReferencedFiles = (entity, relationName, ids) => async (dispatch, getState) => {
  // TODO: here we try to avoid adding duplicates, but if all IDs have not been fetched on
  // the entity side, we may still add duplicates... This should probably best handled by the stack
  const newIds = ids.filter(id => entity[relationName].indexOf(id) === -1)
  await cozy.client.data.addReferencedFiles(entity, newIds)
  const updated = Object.assign({}, entity, { [relationName]: [...entity[relationName], ...newIds] })
  dispatch({ type: ADD_REFERENCED_FILES, entity: updated, relationName, ids: newIds })
  return newIds
}

export const removeReferencedFiles = (entity, relationName, ids) => async (dispatch, getState) => {
  // TODO: we need to make sure the entity have _id and _type props because for now,
  // deleting a photo from the timeline only marginally use this duck and therefore entities
  // passed to this method may not be normalized
  const normalizedEntity = Object.assign({}, entity, { _id: entity.id, _type: entity.type })
  await cozy.client.data.removeReferencedFiles(normalizedEntity, ids)
  dispatch({ type: REMOVE_REFERENCED_FILES, entity: normalizedEntity, relationName, ids })
  return ids
}

export const updateEntity = (entity) => async (dispatch, getState) => {
  try {
    // TODO: handle this action type
    dispatch({ type: UPDATE_ENTITY, entity })
    /* const updated = */ await cozy.client.data.updateAttributes(entity.type, entity.id, entity)
    // TODO: we don't handle the entity's relations here...

    // we forge a standard response with a 'data' property
    const response = { data: [entity] }
    dispatch({ type: RECEIVE_UPDATE_CONFIRM, entity, response })
    return entity
  } catch (error) {
    dispatch({ type: RECEIVE_UPDATE_ERROR, entity, error })
    throw error
  }
}

export const deleteEntity = (entity) => async (dispatch, getState) => {
  try {
    // TODO: handle this action type
    dispatch({ type: DELETE_ENTITY, entity })
    /* const deleted = */ await cozy.client.data.delete(entity.type, entity)
    // TODO: we don't handle the entity's relations here. Do we have to???

    // we forge a standard response with a 'data' property
    const response = { data: [entity] }
    dispatch({ type: RECEIVE_DELETION_CONFIRM, entity, response })
    return entity
  } catch (error) {
    dispatch({ type: RECEIVE_DELETION_ERROR, entity, error })
    throw error
  }
}
