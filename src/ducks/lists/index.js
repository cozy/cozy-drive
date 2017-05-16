import { combineReducers } from 'redux'

// temporary...
import Alerter from '../../components/Alerter'

const FETCH_ENTRIES = 'FETCH_ENTRIES'
const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES'
const RECEIVE_MORE_ENTRIES = 'RECEIVE_MORE_ENTRIES'
const RECEIVE_ERROR = 'RECEIVE_ERROR'
const INSERT_ENTRIES = 'INSERT_ENTRIES'
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
        .catch(error => {
          if (error.name === 'FormattedError') {
            Alerter.error(error.message, error.messageData)
          }
          return dispatch(errorAction(listName, error))
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

export const insertAction = (listName, resp) => ({
  type: INSERT_ENTRIES, name: listName, ...resp
})

export const getList = (state, name) => state.lists[name]
