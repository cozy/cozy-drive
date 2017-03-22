import { getStore } from './store'
import { initService } from './init'
import { logException } from './crash-reporter'
import { loadState } from './localStorage'
import { startMediaUpload, mediaBackup, endMediaUpload } from '../actions/mediaBackup'
import { backupAllowed } from './network'

const hasIosCordovaPlugin = () => {
  return window.cordova.platformId === 'iOS' && window.BackgroundFetch !== undefined
}

export const launchBackground = () => {
  if (hasIosCordovaPlugin()) {
    launchIosBackground()
  }
}

const launchIosBackground = () => {
  var Fetcher = window.BackgroundFetch

  // Your background-fetch handler.
  const fetchCallback = () => {
    console.log('[js] BackgroundFetch initiated')

    loadState().then(persistedState => {
      let store = getStore(persistedState)
      initService(store)

      logException('C\'est moi le Service Background!!!')

      if (store.getState().mobile.settings.backupImages && backupAllowed(getState().mobile.settings.wifiOnly)) {
        logException('start backup on Background')
        const end = () => {
          store.dispatch(endMediaUpload())
          Fetcher.finish()
        }
        store.dispatch(startMediaUpload())
        // TODO: Replace 'Camera' with t('mobile.settings.media_backup.media_folder') but t?
        store.dispatch(mediaBackup('Camera')).then(end).catch(end)
      } else {
        logException('can\'t start backup on Background')
        Fetcher.finish()   // <-- N.B. You MUST called #finish so that native-side can signal completion of the background-thread to the os.
      }
    })
  }

  const failureCallback = (error) => {
    console.log('- BackgroundFetch failed', error)
  }

  const options = {
    stopOnTerminate: false  // <-- true is default
  }

  Fetcher.configure(fetchCallback, failureCallback, options)
}
