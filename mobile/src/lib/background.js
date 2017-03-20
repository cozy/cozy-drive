import { getStore } from './store'
import { initService } from './init'
import { logException } from './crash-reporter'
import { loadState } from './localStorage'

const hasIosCordovaPlugin = () => {
  return device.platform === 'iOS' && window.BackgroundFetch !== undefined
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

        Fetcher.finish()   // <-- N.B. You MUST called #finish so that native-side can signal completion of the background-thread to the os.
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
