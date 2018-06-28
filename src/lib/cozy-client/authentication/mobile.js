/* global prompt */
const REGISTRATION_ABORT = 'REGISTRATION_ABORT'

// With InAppBrowser

const onIOS = () =>
  window.cordova !== undefined && window.cordova.platformId === 'ios'

const hasCordovaPlugin = () => {
  return (
    window.cordova !== undefined && window.cordova.InAppBrowser !== undefined
  )
}

// With SafariViewController

const hasSafariPlugin = () => window.SafariViewController !== undefined

const isSafariPluginAvailable = () => {
  return new Promise(resolve => {
    if (!hasSafariPlugin()) {
      resolve(false)
      return
    }
    window.SafariViewController.isAvailable(available => resolve(available))
  })
}

export const authenticateWithCordova = async url => {
  const isSafari = await isSafariPluginAvailable()
  if (onIOS() && isSafari) {
    return new Promise((resolve, reject) => {
      window.SafariViewController.show(
        {
          url: url,
          transition: 'curl' // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
          // enterReaderModeIfAvailable: readerMode, // default false
          // tintColor: "#00ffff", // default is ios blue
          // barColor: "#0000ff", // on iOS 10+ you can change the background color as well
          // controlTintColor: "#ffffff" // on iOS 10+ you can override the default tintColor
        },
        // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
        result => {
          if (result.event === 'closed') {
            reject(new Error(REGISTRATION_ABORT))
          }
        },
        error => {
          console.log('KO: ' + error)
          reject(new Error(REGISTRATION_ABORT))
        }
      )

      const handle = window.handleOpenURL
      window.handleOpenURL = url => {
        window.SafariViewController.hide()
        resolve(url)
        if (handle) {
          window.handleOpenURL = handle
        }
      }
    })
  } else if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      const target = '_blank'
      const options = 'clearcache=yes,zoom=no'
      const inAppBrowser = window.cordova.InAppBrowser.open(
        url,
        target,
        options
      )

      const removeListener = () => {
        inAppBrowser.removeEventListener('loadstart', onLoadStart)
        inAppBrowser.removeEventListener('exit', onExit)
      }

      const onLoadStart = ({ url }) => {
        const accessCode = /\?access_code=(.+)$/.test(url)
        const state = /\?state=(.+)$/.test(url)

        if (accessCode || state) {
          resolve(url)
          removeListener()
          inAppBrowser.close()
        }
      }

      const onExit = () => {
        reject(new Error(REGISTRATION_ABORT))
        removeListener()
        inAppBrowser.close()
      }

      inAppBrowser.addEventListener('loadstart', onLoadStart)
      inAppBrowser.addEventListener('exit', onExit)
    })
  } else {
    /**
     * for dev purpose:
     * In oauth workflow, the server displays an authorization page
     * User must accept to give permission then the server gives an url
     * with query parameters used by cozy-client-js to initialize itself.
     *
     * This hack let developers open the authorization page in a new tab
     * then get the "access_code" url and paste it in the prompt to let the
     * application initialize and redirect to other pages.
     */
    console.log(url)
    return new Promise(resolve => {
      setTimeout(() => {
        const token = prompt('Paste the url here:')
        resolve(token)
      }, 10000)
    })
  }
}
