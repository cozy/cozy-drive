const START_SYNC = 'START_SYNC'
const INITIAL_SYNC_OK = 'INITIAL_SYNC_OK'
const INITIAL_SYNC_ERROR = 'INITIAL_SYNC_ERROR'
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

const syncInitialState = {
  started: false,
  initialStatus: 'pending',
  doctypes: {}
}

const synchronization = (state = syncInitialState, action) => {
  switch (action.type) {
    case START_SYNC:
      return {
        ...state,
        started: true
      }
    case INITIAL_SYNC_OK:
      return {
        ...state,
        initialStatus: 'ok'
      }
    case INITIAL_SYNC_ERROR:
      return {
        ...state,
        initialStatus: 'error'
      }
    case START_DOCTYPE_SYNC:
    case SYNC_DOCTYPE_OK:
    case SYNC_DOCTYPE_ERROR:
      return {
        ...state,
        doctypes: {
          ...state.doctypes,
          [action.doctype]: doctypeSync(state.doctypes[action.doctype], action)
        }
      }
    default:
      return state
  }
}

export default synchronization

export const startSync = () => ({
  types: [START_SYNC, INITIAL_SYNC_OK, INITIAL_SYNC_ERROR],
  promise: (client, dispatch) => client.startSync(dispatch)
})

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

export const hasSyncStarted = state => state.cozy.synchronization.started

export const isSyncOk = state =>
  state.cozy.synchronization.initialStatus === 'ok'

export const isSyncInError = state =>
  state.cozy.synchronization.initialStatus === 'error'

export const isFirstSync = state => {
  const seqNumbers = Object.keys(state.cozy.synchronization.doctypes).map(
    doctype => state.cozy.synchronization.doctypes[doctype].seqNumber
  )
  return seqNumbers.every(number => number === 0)
}

export const isSynced = state => isSyncOk(state) || isSyncInError(state)
