import { combineReducers } from 'redux'

const FETCH_ENTRIES = 'FETCH_ENTRIES'
const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES'
const RECEIVE_MORE_ENTRIES = 'RECEIVE_MORE_ENTRIES'
const RECEIVE_ERROR = 'RECEIVE_ERROR'
const INSERT_ENTRIES = 'INSERT_ENTRIES'
const UPDATE_ENTRIES = 'UPDATE_ENTRIES'
const DELETE_ENTRY = 'DELETE_ENTRY'
const EMIT_ERROR = 'EMIT_ERROR'

const entries = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_MORE_ENTRIES:
      return [
        ...state,
        ...action.entries
      ]
    case RECEIVE_ENTRIES:
      return action.entries
    case INSERT_ENTRIES:
      return [
        ...action.entries,
        ...state
      ]
    case UPDATE_ENTRIES:
      return state.map(entry => {
        let updatedEntry = action.entries.find(actionEntry => (actionEntry._id === entry._id))
        return updatedEntry || entry
      })
    case DELETE_ENTRY:
      // TODO: quick and dirty fix for removeFromAlbum (we got IDs instead of photos)
      const id = typeof action.entity === 'object' ? action.entity.id || action.entity._id : action.entity
      // TODO: why is the back sending an id prop instead of a _id prop here???
      const idx = state.findIndex(e => e._id === id)
      if (idx === -1) return state
      return [
        ...state.slice(0, idx),
        ...state.slice(idx + 1)
      ]
    default:
      return state
  }
}

const fetchStatus = (state = 'pending', action) => {
  switch (action.type) {
    case FETCH_ENTRIES:
      return 'loading'
    case RECEIVE_ENTRIES:
      return 'loaded'
    case RECEIVE_ERROR:
      return 'failed'
    default:
      return state
  }
}

const lastFetch = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_ENTRIES:
    case RECEIVE_MORE_ENTRIES:
      return Date.now()
    default:
      return state
  }
}

const hasMore = (state = false, action) => {
  switch (action.type) {
    case RECEIVE_ENTRIES:
    case RECEIVE_MORE_ENTRIES:
      return action.next !== undefined ? action.next : state
    default:
      return state
  }
}

const index = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_ENTRIES:
      return action.index !== undefined ? action.index : state
    default:
      return state
  }
}

const listReducer = combineReducers({
  entries,
  fetchStatus,
  lastFetch,
  hasMore,
  index
})

const listsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ENTRIES:
    case RECEIVE_ENTRIES:
    case RECEIVE_MORE_ENTRIES:
    case RECEIVE_ERROR:
    case INSERT_ENTRIES:
    case UPDATE_ENTRIES:
    case DELETE_ENTRY:
      return Object.assign({}, state, { [action.name]: listReducer(state[action.name] || {}, action) })
    default:
      return state
  }
}

export default listsReducer

export const createFetchAction = (listName, saga) => {
  return (...args) => {
    return (dispatch, getState) => {
      let fetchingMoreEntries = false
      const existingList = getList(getState(), listName)
      if (existingList) {
        const { fetchStatus, hasMore } = existingList
        fetchingMoreEntries = fetchStatus === 'loaded' && hasMore === true
      }
      if (!fetchingMoreEntries) {
        dispatch({ type: FETCH_ENTRIES, name: listName })
      }
      return saga(...args)
        .then(resp => {
          return fetchingMoreEntries && resp.skip !== 0
            ? dispatch({ type: RECEIVE_MORE_ENTRIES, name: listName, ...resp })
            : dispatch({ type: RECEIVE_ENTRIES, name: listName, ...resp })
        })
        .catch(error => dispatch({ type: RECEIVE_ERROR, name: listName, error }))
    }
  }
}

const shouldRefetch = (list) => {
  if (!list) {
    return true
  }
  // here we could add conditions so that we don't refetch a list fetched 30s ago
  return true
}

export const createFetchIfNeededAction = (listName, saga) => {
  return (...args) => {
    return (dispatch, getState) => {
      const existingList = getList(getState(), listName)
      if (existingList && !shouldRefetch(existingList)) {
        return Promise.resolve(existingList)
      }
      return dispatch(createFetchAction(listName, saga)(...args))
    }
  }
}

export const createInsertAction = (listName, saga) => {
  return (...args) => {
    return (dispatch, getState) => {
      const existingList = getList(getState(), listName)
      return saga(...args)
        .then(resp => {
          if (existingList) {
            return dispatch(insertAction(listName, resp))
          } else {
            return resp
          }
        })
    }
  }
}

export const createUpdateAction = (listName, saga) => {
  return (...args) => {
    return (dispatch, getState) => {
      const existingList = getList(getState(), listName)
      return saga(...args)
        .then(resp => {
          if (existingList) {
            return dispatch(updateAction(listName, resp))
          } else {
            return resp
          }
        })
    }
  }
}

export const createDeleteAction = (listName, saga) => {
  return (...args) => {
    return (dispatch, getState) => {
      const existingList = getList(getState(), listName)
      return saga(...args)
        .then(resp => {
          if (existingList) {
            resp.entries.forEach(e => dispatch(deleteAction(listName, e)))
          }
          return resp
        })
    }
  }
}

export const errorAction = (listName, error) => ({
  type: EMIT_ERROR,
  name: listName,
  error,
  alert: {
    message: error.message || error
  }
})

// TODO: remove the discrepancy between insert and deleteAction inputs (full response with entries vs single entry)
export const insertAction = (listName, resp) => ({
  type: INSERT_ENTRIES, name: listName, ...resp
})

export const updateAction = (listName, resp) => ({
  type: UPDATE_ENTRIES, name: listName, ...resp
})

export const deleteAction = (listName, entity) => ({
  type: DELETE_ENTRY, name: listName, entity
})

export const getList = (state, name) => state.lists[name]
