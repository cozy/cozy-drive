/* eslint no-console: 0 */
import configureStore from 'drive/store/configureStore'
import { loadState } from 'drive/store/persistedState'
import { startMediaBackup } from 'drive/mobile/modules/mediaBackup/duck'
import { initClient } from './cozy-helper'
import { logException, configureReporter } from 'drive/lib/reporter'
import { getTranslateFunction } from './i18n'

import {
  getPlatform,
  isMobileApp,
  isIOSApp,
  isAndroidApp
} from 'cozy-device-helper'

/*
  This files is split on 4 parts:
    - GENERIC: Platform agnostic
    - SERVICE: The service background
    - ANDROID: The Android-specific part
    - IOS: The iOS-specific part

  Only 3 functions are export:
    - updateStatusBackgroundService: to enbale/disable background service
    - startBackgroundService: to start background service
    - disableBackgroundService: to disable background service

  For each platform (Android, iOS) we have:
    - has__platform__CordovaPlugin: Checks if the plugin is installed
    - enable__platform__BackgroundService and disable__platform__BackgroundService
    - start__platform__BackgroundService: Allowing to add a specific callback at the end of the service
*/

// GENERIC

export const updateStatusBackgroundService = backupImages => {
  if (backupImages) {
    enableBackgroundService()
  } else {
    disableBackgroundService()
  }
}

export const startBackgroundService = () => {
  if (hasIosCordovaPlugin()) {
    startIosBackgroundService()
  } else if (hasAndroidCordovaPlugin()) {
    startAndroidBackgroundService()
  } else {
    notCompatibleError()
  }
}

const enableBackgroundService = () => {
  if (hasIosCordovaPlugin()) {
    enableIosBackgroundService()
  } else if (hasAndroidCordovaPlugin()) {
    enableAndroidBackgroundService()
  } else {
    notCompatibleError()
  }
}

export const disableBackgroundService = async () => {
  if (hasIosCordovaPlugin()) {
    disableIosBackgroundService()
  } else if (hasAndroidCordovaPlugin()) {
    await disableAndroidBackgroundService()
  } else {
    notCompatibleError()
  }
}

const notCompatibleError = () => {
  const msg = 'Background Service is not compatible with your platform.'
  console.warn(msg)
  if (isMobileApp()) {
    console.log(getPlatform())
    if (isIOSApp()) {
      console.log(window.BackgroundFetch)
    } else if (isAndroidApp()) {
      console.log(window.JSBackgroundService)
    }
  }
  logException(msg)
}

// SERVICE

const backgroundService = () =>
  new Promise(resolve => {
    console.log('BackgroundFetch initiated')

    loadState()
      .then(persistedState => {
        const cozyURL = persistedState.mobile.settings.serverUrl
        configureReporter()
        const client = initClient(cozyURL)
        const store = configureStore(
          client,
          getTranslateFunction(),
          persistedState
        )
        return store.dispatch(startMediaBackup())
      })
      .then(resolve)
      .catch(resolve)
  })

// ANDROID

const hasAndroidCordovaPlugin = () =>
  isAndroidApp() && window.JSBackgroundService !== undefined

const enableAndroidBackgroundService = async () => {
  const isEnable = await isEnableAndroidBackgroundService()
  if (!isEnable) {
    const repeatingPeriod = 60 * 60 * 1000
    window.JSBackgroundService.setRepeating(repeatingPeriod, err => {
      if (err) {
        console.warn(err)
        logException('enableAndroidBackgroundService error')
      }
    })
  }
}

const disableAndroidBackgroundService = async () => {
  const isEnable = await isEnableAndroidBackgroundService()
  if (isEnable) {
    window.JSBackgroundService.cancelRepeating(err => {
      if (err) {
        console.warn(err)
        logException('disableAndroidBackgroundService error')
      }
    })
  }
}

const startAndroidBackgroundService = () => {
  backgroundService().then(() => {
    stopAndroidBackgroundService()
  })
}

const stopAndroidBackgroundService = () => {
  window.service.workDone()
}

const isEnableAndroidBackgroundService = () =>
  new Promise(resolve => {
    window.JSBackgroundService.isRepeating((err, isSet) => {
      if (err) {
        console.warn(err)
        logException('isEnableAndroidBackgroundService error')
        resolve(false)
      }
      resolve(isSet)
    })
  })

// IOS

const hasIosCordovaPlugin = () =>
  isIOSApp() && window.BackgroundFetch !== undefined

const enableIosBackgroundService = () => {
  // documentation: https://github.com/transistorsoft/cordova-plugin-background-fetch
  const fetcher = window.BackgroundFetch

  const failureCallback = error => {
    console.log('BackgroundFetch failed', error)
  }

  const options = {
    stopOnTerminate: false
  }
  fetcher.configure(startIosBackgroundService, failureCallback, options)
}

const disableIosBackgroundService = () => {
  window.BackgroundFetch.stop()
}

const startIosBackgroundService = () => {
  backgroundService().then(() => {
    stopIosBackgroundService()
  })
}

const stopIosBackgroundService = () => {
  window.BackgroundFetch.finish()
}
