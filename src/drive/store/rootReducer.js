/* global __TARGET__ */
import { combineReducers } from 'redux'
import baseReducers from '../reducers'

import { default as settings } from '../mobile/ducks/settings'
import { default as mediaBackup } from '../mobile/ducks/mediaBackup'
import { default as authorization, UNLINK } from '../mobile/ducks/authorization'
import { default as replication } from '../mobile/ducks/replication/duck'

const mobileReducer = combineReducers({
  authorization,
  settings,
  replication,
  mediaBackup
})

// Per Dan Abramov: https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store/35641992#35641992
const createRootReducer = client => {
  const appReducer =
    __TARGET__ === 'mobile'
      ? combineReducers({
          ...baseReducers,
          mobile: mobileReducer,
          cozy: client.reducer()
        })
      : combineReducers({
          ...baseReducers,
          cozy: client.reducer()
        })

  const rootReducer = (state, action) => {
    if (action.type === UNLINK) {
      state = undefined
    }
    return appReducer(state, action)
  }

  return rootReducer
}

export default createRootReducer
