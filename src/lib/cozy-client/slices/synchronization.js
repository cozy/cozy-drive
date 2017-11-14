const START_SYNC = 'START_SYNC'
const START_DOCTYPE_SYNC = 'START_DOCTYPE_SYNC'
const SYNC_DOCTYPE_OK = 'SYNC_DOCTYPE_OK'
const SYNC_DOCTYPE_ERROR = 'SYNC_DOCTYPE_ERROR'

const doctypeSyncInitialState = {
  syncStatus: 'pending',
  lastSync: null,
  seqNumber: 0
}

const doctypeSync = (state = doctypeSyncInitialState, action) => {
  switch (action.type) {
    case START_DOCTYPE_SYNC:
      return {
        ...state,
        syncStatus: 'syncing',
        seqNumber: action.seqNumber
      }
    case SYNC_DOCTYPE_OK:
      return {
        ...state,
        syncStatus: 'done',
        lastSync: Date.now()
      }
    case SYNC_DOCTYPE_ERROR:
      return {
        ...state,
        syncStatus: 'error',
        lastSync: Date.now()
      }
    default:
      return state
  }
}

const synchronization = (state = {}, action) => {
  switch (action.type) {
    case START_DOCTYPE_SYNC:
    case SYNC_DOCTYPE_OK:
    case SYNC_DOCTYPE_ERROR:
      return {
        ...state,
        [action.doctype]: doctypeSync(state[action.doctype], action)
      }
    default:
      return state
  }
}

export default synchronization

export const startSync = () => async (dispatch, getState) => {
  return dispatch({
    type: START_SYNC,
    promise: client => client.startSync(dispatch)
  })
}

export const startDoctypeSync = (doctype, seqNumber = 0) => ({
  type: START_DOCTYPE_SYNC,
  doctype,
  seqNumber
})

export const syncDoctypeOk = (doctype, infos) => ({
  type: SYNC_DOCTYPE_OK,
  doctype,
  infos
})

export const syncDoctypeError = (doctype, error) => ({
  type: SYNC_DOCTYPE_ERROR,
  doctype,
  error
})

export const isFirstSync = state => {
  const seqNumbers = Object.keys(state.cozy.synchronization).map(
    doctype => state.cozy.synchronization[doctype].seqNumber
  )
  return seqNumbers.every(number => number === 0)
}

export const isSynced = state => {
  const timestamps = Object.keys(state.cozy.synchronization).map(
    doctype => state.cozy.synchronization[doctype].lastSync
  )
  return timestamps.every(ts => ts !== null)
}
