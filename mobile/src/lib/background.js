import { getStore } from './store'
import { initService } from './init'
import { logException } from './crash-reporter'
import { loadState } from './localStorage'
import { startMediaUpload, mediaBackup, endMediaUpload } from '../actions/mediaBackup'
import { backupAllowed } from './network'
import { initPolyglot } from '../../../src/lib/I18n'

const hasIosCordovaPlugin = () => {
  return window.cordova !== undefined && window.cordova.platformId === 'ios' && window.BackgroundFetch !== undefined
}

export const startBackgroundService = () => {
  if (hasIosCordovaPlugin()) {
    startIosBackgroundService()
  }
}

export const stopBackgroundService = () => {
  if (hasIosCordovaPlugin()) {
    stopIosBackgroundService()
  }
}

const startIosBackgroundService = () => {
  let Fetcher = window.BackgroundFetch

  const fetchCallback = () => {
    console.log('[js] BackgroundFetch initiated')

    loadState().then(persistedState => {
      let store = getStore(persistedState)
      initService(store)

      logException('C\'est moi le Service Background!!!')

      if (store.getState().mobile.settings.backupImages && backupAllowed(store.getState().mobile.settings.wifiOnly)) {
        logException('start backup on Background')
        const end = () => {
          store.dispatch(endMediaUpload())
          Fetcher.finish()
        }
        store.dispatch(startMediaUpload())

        const context = window.context
        const lang = (navigator && navigator.language) ? navigator.language.slice(0, 2) : 'en'
        const polyglot = initPolyglot(context, lang)

        store.dispatch(mediaBackup(polyglot.t('mobile.settings.media_backup.media_folder'))).then(end).catch(end)
      } else {
        logException('can\'t start backup on Background')
        Fetcher.finish()
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

const stopIosBackgroundService = () => {
  let Fetcher = window.BackgroundFetch

  Fetcher.stop()
}
