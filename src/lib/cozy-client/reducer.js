import { combineReducers } from 'redux'
import { removeObjectProperty, mapValues } from './utils'
import sharings, {
  FETCH_SHARINGS,
  getSharings,
  getSharingDetails
} from './slices/sharings'
import synchronization from './slices/synchronization'

const FETCH_DOCUMENT = 'FETCH_DOCUMENT'
const FETCH_COLLECTION = 'FETCH_COLLECTION'
const RECEIVE_DATA = 'RECEIVE_DATA'
const RECEIVE_ERROR = 'RECEIVE_ERROR'
export const CREATE_DOCUMENT = 'CREATE_DOCUMENT'
const UPDATE_DOCUMENT = 'UPDATE_DOCUMENT'
const DELETE_DOCUMENT = 'DELETE_DOCUMENT'
const RECEIVE_NEW_DOCUMENT = 'RECEIVE_NEW_DOCUMENT'
const RECEIVE_UPDATED_DOCUMENT = 'RECEIVE_UPDATED_DOCUMENT'
const RECEIVE_DELETED_DOCUMENT = 'RECEIVE_DELETED_DOCUMENT'
const FETCH_REFERENCED_FILES = 'FETCH_REFERENCED_FILES'
const ADD_REFERENCED_FILES = 'ADD_REFERENCED_FILES'
const REMOVE_REFERENCED_FILES = 'REMOVE_REFERENCED_FILES'

const documents = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_DATA:
      const { data } = action.response
      if (data.length === 0) return state
      const dataDoctype = getArrayDoctype(data)
      return {
        ...state,
        [dataDoctype]: {
          ...state[dataDoctype],
          ...objectifyDocumentsArray(data)
        }
      }
    case RECEIVE_NEW_DOCUMENT:
    case RECEIVE_UPDATED_DOCUMENT:
      const doc = action.response.data[0]
      return {
        ...state,
        [doc._type]: {
          ...state[doc._type],
          [doc.id]: doc
        }
      }
    case RECEIVE_DELETED_DOCUMENT:
      const deleted = action.response.data[0]
      return {
        ...state,
        [deleted._type]: removeObjectProperty(state[deleted._type], deleted.id)
      }
    case ADD_REFERENCED_FILES:
      return {
        ...state,
        'io.cozy.files': {
          ...state['io.cozy.files'],
          ...updateFilesReferences(
            state['io.cozy.files'],
            action.ids,
            action.document
          )
        }
      }
    case REMOVE_REFERENCED_FILES:
      return {
        ...state,
        'io.cozy.files': {
          ...state['io.cozy.files'],
          ...removeFilesReferences(
            state['io.cozy.files'],
            action.ids,
            action.document
          )
        }
      }
    default:
      return state
  }
}

const objectifyDocumentsArray = documents =>
  documents.reduce((obj, doc) => ({ ...obj, [doc.id]: doc }), {})

const updateFileReference = (
  { relationships: { referenced_by, ...relationships }, ...file },
  doc
) => ({
  ...file,
  relationships: {
    ...relationships,
    [referenced_by.data]:
      referenced_by.data === null
        ? [{ id: doc.id, type: doc.type }]
        : [...referenced_by.data, { id: doc.id, type: doc.type }]
  }
})

const updateFilesReferences = (files, newlyReferencedIds, doc) =>
  newlyReferencedIds.reduce(
    (updated, id) => ({
      ...updated,
      [id]: updateFileReference(files[id], doc)
    }),
    {}
  )

const removeFileReferences = (
  { relationships: { referenced_by, ...relationships }, ...file },
  doc
) => ({
  ...file,
  relationships: {
    ...relationships,
    [referenced_by.data]: referenced_by.data.filter(
      rel => rel.type !== doc.type && rel.id !== doc.id
    )
  }
})

const removeFilesReferences = (files, removedIds, doc) =>
  removedIds.reduce(
    (updated, id) => ({
      ...updated,
      [id]: removeFileReferences(files[id], doc)
    }),
    {}
  )

const getDoctype = ({ _type: doctype }) => {
  // TODO: don't know why the stack returns 'file' here..
  if (doctype === 'file') {
    return 'io.cozy.files'
  }
  return doctype
}

const getArrayDoctype = documents => getDoctype(documents[0])

// collection reducers
const collectionInitialState = {
  type: null,
  options: {},
  fetchStatus: 'pending',
  lastFetch: null,
  hasMore: false,
  count: 0,
  ids: []
}

const collection = (state = collectionInitialState, action) => {
  switch (action.type) {
    case FETCH_COLLECTION:
    case FETCH_REFERENCED_FILES:
      return {
        ...state,
        type: action.doctype || 'io.cozy.files',
        options: action.options,
        fetchStatus: action.skip > 0 ? 'loadingMore' : 'loading'
      }
    case RECEIVE_DATA:
      const response = action.response
      return {
        ...state,
        fetchStatus: 'loaded',
        lastFetch: Date.now(),
        hasMore: response.next !== undefined ? response.next : state.hasMore,
        count:
          response.meta && response.meta.count
            ? response.meta.count
            : response.data.length,
        ids: !action.skip
          ? response.data.map(doc => doc.id)
          : [...state.ids, ...response.data.map(doc => doc.id)]
      }
    case ADD_REFERENCED_FILES:
      return {
        ...state,
        type: 'io.cozy.files',
        count: state.count + action.ids.length,
        ids: [...state.ids, ...action.ids]
      }
    case REMOVE_REFERENCED_FILES:
      return {
        ...state,
        count: state.count - action.ids.length,
        ids: state.ids.filter(id => action.ids.indexOf(id) === -1)
      }
    case RECEIVE_ERROR:
      return {
        ...state,
        fetchStatus: 'failed'
      }
    case RECEIVE_NEW_DOCUMENT:
      return {
        ...state,
        ids: [...state.ids, action.response.data[0].id]
      }
    case RECEIVE_DELETED_DOCUMENT:
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.response.data[0].id)
      }
    default:
      return state
  }
}

const collections = (state = {}, action) => {
  const applyUpdate = (collections, updateAction) =>
    updateAction.updateCollections.reduce(
      (updated, name) => ({
        ...updated,
        [name]: collection(collections[name], action)
      }),
      {}
    )

  switch (action.type) {
    case FETCH_COLLECTION:
    case FETCH_REFERENCED_FILES:
    case ADD_REFERENCED_FILES:
    case REMOVE_REFERENCED_FILES:
    case RECEIVE_DATA:
    case RECEIVE_ERROR:
      if (!action.collection) {
        return state
      }
      return {
        ...state,
        [action.collection]: collection(state[action.collection], action)
      }
    case RECEIVE_NEW_DOCUMENT:
    case RECEIVE_DELETED_DOCUMENT:
      if (!action.updateCollections) {
        return state
      }
      return {
        ...state,
        ...applyUpdate(state, action)
      }
    default:
      return state
  }
}

export default combineReducers({
  collections,
  documents,
  sharings,
  synchronization
})

export const fetchCollection = (name, doctype, options = {}, skip = 0) => ({
  types: [FETCH_COLLECTION, RECEIVE_DATA, RECEIVE_ERROR],
  collection: name,
  doctype,
  options,
  skip,
  promise: client => client.fetchCollection(name, doctype, options, skip)
})

export const fetchDocument = (doctype, id) => ({
  types: [FETCH_DOCUMENT, RECEIVE_DATA, RECEIVE_ERROR],
  doctype,
  id,
  promise: client => client.fetchDocument(doctype, id)
})

export const fetchReferencedFiles = (doc, skip = 0) => ({
  types: [FETCH_REFERENCED_FILES, RECEIVE_DATA, RECEIVE_ERROR],
  collection: `${doc._type}/${doc.id}#files`,
  document: doc,
  options: {},
  skip,
  promise: client => client.fetchReferencedFiles(doc, skip)
})

export const createDocument = (doctype, doc, actionOptions = {}) => ({
  types: [CREATE_DOCUMENT, RECEIVE_NEW_DOCUMENT, RECEIVE_ERROR],
  doctype,
  document: doc,
  promise: client => client.createDocument(doctype, doc),
  ...actionOptions
})

export const updateDocument = (doc, actionOptions = {}) => ({
  types: [UPDATE_DOCUMENT, RECEIVE_UPDATED_DOCUMENT, RECEIVE_ERROR],
  document: doc,
  promise: client => client.updateDocument(doc),
  ...actionOptions
})

export const deleteDocument = (doc, actionOptions = {}) => ({
  types: [DELETE_DOCUMENT, RECEIVE_DELETED_DOCUMENT, RECEIVE_ERROR],
  document: doc,
  promise: client => client.deleteDocument(doc),
  ...actionOptions
})

export const createFile = (file, dirID, actionOptions = {}) => ({
  types: [CREATE_DOCUMENT, RECEIVE_NEW_DOCUMENT, RECEIVE_ERROR],
  doctype: 'io.cozy.files',
  promise: client => client.createFile(file, dirID),
  ...actionOptions
})

export const trashFile = (file, actionOptions = {}) => ({
  types: [DELETE_DOCUMENT, RECEIVE_DELETED_DOCUMENT, RECEIVE_ERROR],
  document: file,
  promise: client => client.trashFile(file),
  ...actionOptions
})

export const addReferencedFiles = (doc, ids) => ({
  type: ADD_REFERENCED_FILES,
  collection: `${doc._type}/${doc._id}#files`,
  document: doc,
  ids,
  promise: client => client.addReferencedFiles(doc, ids)
})

export const removeReferencedFiles = (doc, ids) => ({
  type: REMOVE_REFERENCED_FILES,
  collection: `${doc._type}/${doc._id}#files`,
  document: doc,
  ids,
  promise: client => client.removeReferencedFiles(doc, ids)
})

export const makeActionCreator = promise => ({ promise })

export const makeFetchMoreAction = (
  { types, collection, document, doctype, options },
  skip
) =>
  types[0] === FETCH_REFERENCED_FILES
    ? fetchReferencedFiles(document, skip)
    : fetchCollection(collection, doctype, options, skip)

export const applySelectorForAction = (state, action) => {
  switch (action.types[0]) {
    case FETCH_COLLECTION:
    case FETCH_REFERENCED_FILES:
      return getCollection(state, action.collection)
    case FETCH_DOCUMENT:
      return getDocument(state, action.doctype, action.id)
    case FETCH_SHARINGS:
      return action.id
        ? getSharingDetails(state, action.doctype, action.id, action.options)
        : getSharings(state, action.doctype, action.options)
    default:
      return null
  }
}

export const enhancePropsForActions = (props, fetchActions, dispatch) =>
  mapValues(fetchActions, (action, propName) => {
    const dataObject = props[propName]
    switch (action.types[0]) {
      case FETCH_COLLECTION:
      case FETCH_REFERENCED_FILES:
        return {
          ...dataObject,
          fetchMore: dataObject.hasMore
            ? () =>
                dispatch(makeFetchMoreAction(action, dataObject.data.length))
            : null
        }
      default:
        return dataObject
    }
  })

// selectors
const mapDocumentsToIds = (documents, doctype, ids) =>
  ids.map(id => documents[doctype][id])

export const getCollection = (state, name) => {
  const collection = state.cozy.collections[name]
  if (!collection) {
    return { ...collectionInitialState, data: null }
  }
  return {
    ...collection,
    data: mapDocumentsToIds(
      state.cozy.documents,
      collection.type,
      collection.ids
    )
  }
}

export const getDocument = (state, doctype, id) => {
  const documents = state.cozy.documents[doctype]
  if (!documents) {
    return null
  }
  return documents[id]
}

export const isCollectionFetched = (state, name) =>
  state.cozy.collections[name] &&
  state.cozy.collections[name].fetchStatus === 'loaded'
