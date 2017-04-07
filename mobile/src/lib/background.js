import { configureStore } from './store'
import { initService } from './init'
import { logException } from './reporter'
import { loadState } from './localStorage'
import { startMediaUpload, mediaBackup, endMediaUpload } from '../actions/mediaBackup'
import { backupAllowed } from './network'
import { initPolyglot } from '../../../src/lib/I18n'

const hasIosCordovaPlugin = () => window.cordova !== undefined && window.cordova.platformId === 'ios' && window.BackgroundFetch !== undefined

const hasAndroidCordovaPlugin = () => window.cordova !== undefined && window.cordova.platformId === 'android' && window.cordova.plugins.backgroundMode !== undefined

export const startBackgroundService = () => {
  if (hasIosCordovaPlugin()) {
    startIosBackgroundService()
  } else if (hasAndroidCordovaPlugin()) {
    startAndroidBackgroundService()
  } else {
    console.log('Background Service is not compatible with your platform.')
  }
}

export const stopBackgroundService = () => {
  if (hasIosCordovaPlugin()) {
    stopIosBackgroundService()
  } else if (hasAndroidCordovaPlugin()) {
    stopAndroidBackgroundService()
  }
}

const startAndroidBackgroundService = () => {
  const backgroundMode = window.cordova.plugins.backgroundMode
  backgroundMode.enable()

  backgroundMode.onactivate = () => {
    loadState().then((persistedState) => {
      const store = getStore(persistedState)
      initService(store)

      logException('It\'s me Background Service!!!')

      const state = store.getState()
      setInterval(
        () => {
          if (state.mobile.settings.backupImages && backupAllowed(state.mobile.settings.wifiOnly)) {
            const end = () => {
              store.dispatch(endMediaUpload())
            }
            store.dispatch(startMediaUpload())

            const context = window.context
            const lang = (navigator && navigator.language) ? navigator.language.slice(0, 2) : 'en'
            const polyglot = initPolyglot(context, lang)
            const dir = polyglot.t('mobile.settings.media_backup.media_folder')

            store.dispatch(mediaBackup(dir)).then(end).catch(end)
          }
        },
        10000
      )
    })
  }
}

const startIosBackgroundService = () => {
  // documentation: https://github.com/transistorsoft/cordova-plugin-background-fetch
  const fetcher = window.BackgroundFetch

  const fetchCallback = () => {
    console.log('BackgroundFetch initiated')

    loadState().then(persistedState => {
      const store = configureStore(persistedState)
      initService(store)

      logException('It\'s me Background Service!!!')

      const state = store.getState()
      if (state.mobile.settings.backupImages && backupAllowed(state.mobile.settings.wifiOnly)) {
        const end = () => {
          store.dispatch(endMediaUpload())
          fetcher.finish()
        }
        store.dispatch(startMediaUpload())

        const context = window.context
        const lang = (navigator && navigator.language) ? navigator.language.slice(0, 2) : 'en'
        const polyglot = initPolyglot(context, lang)
        const dir = polyglot.t('mobile.settings.media_backup.media_folder')

        store.dispatch(mediaBackup(dir)).then(end).catch(end)
      } else {
        fetcher.finish()
      }
    })
  }

  const failureCallback = (error) => {
    console.log('BackgroundFetch failed', error)
  }

  const options = {
    stopOnTerminate: false
  }

  fetcher.configure(fetchCallback, failureCallback, options)
}

const stopIosBackgroundService = () => {
  window.BackgroundFetch.stop()
}

const stopAndroidBackgroundService = () => {
  window.cordova.plugins.backgroundMode.disable()
}
