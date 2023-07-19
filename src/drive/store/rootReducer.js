/* global __TARGET__ */
import { combineReducers } from 'redux'

import { default as view } from 'drive/web/modules/navigation/duck'
import { default as filelist } from 'drive/web/modules/filelist/duck'
// TODO: Get rid of this, local state would be better
import { default as rename } from 'drive/web/modules/drive/rename'
import { default as upload } from 'drive/web/modules/upload'
// TODO: Move this to his own module/duck?
import { default as availableOffline } from 'drive/mobile/modules/offline/duck'
import { default as ui } from 'react-cozy-helpers'

import { default as settings } from 'drive/mobile/modules/settings/duck'
import { default as mediaBackup } from 'drive/mobile/modules/mediaBackup/duck'
import {
  default as authorization,
  UNLINK
} from 'drive/mobile/modules/authorization/duck'

// Per Dan Abramov: https://stackoverflow.com/questions/35622588/how-to-reset-the-state-of-a-redux-store/35641992#35641992
const createRootReducer = client => {
  const baseReducers = {
    ui,
    view,
    filelist,
    upload,
    rename,
    availableOffline
  }

  const mobileReducer = combineReducers({
    authorization,
    settings,
    mediaBackup
  })

  const reducers = {
    ...baseReducers,
    cozy: client.reducer()
  }

  if (__TARGET__ === 'mobile') {
    reducers.mobile = mobileReducer
  }

  const appReducer = combineReducers(reducers)

  const rootReducer = (state, action) => {
    if (action.type === UNLINK) {
      state = undefined // eslint-disable-line no-param-reassign
    }
    return appReducer(state, action)
  }

  return rootReducer
}

export default createRootReducer
