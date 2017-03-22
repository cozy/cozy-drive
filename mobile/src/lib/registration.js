const hasCordovaPlugin = () => {
  return window.cordova !== undefined &&
    window.cordova.InAppBrowser !== undefined
}

const openRegistrationWith = inAppBrowser => new Promise(resolve => {
  inAppBrowser.addEventListener('loadstart', ({url}) => {
    const accessCode = /\?access_code=(.+)$/.test(url)
    const state = /\?state=(.+)$/.test(url)

    if (accessCode || state) {
      resolve(url)
    }
  })
})

export const onRegistered = (client, url) => {
  if (hasCordovaPlugin()) {
    return new Promise((resolve, reject) => {
      const target = '_blank'
      const options = 'clearcache=yes'
      const inAppBrowser = window.cordova.InAppBrowser.open(url, target, options)
      return openRegistrationWith(inAppBrowser)
      .then(
        url => {
          inAppBrowser.close()
          resolve(url)
        },
        err => {
          inAppBrowser.close()
          reject(err)
        }
      )
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
