/* global prompt */

const hasCordovaPlugin = () => {
  return (
    window.cordova !== undefined && window.cordova.InAppBrowser !== undefined
  )
}

const REGISTRATION_ABORT = 'REGISTRATION_ABORT'

export const authenticateWithCordova = url => {
  if (hasCordovaPlugin()) {
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
