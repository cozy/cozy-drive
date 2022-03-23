/* eslint-disable no-console */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
const isLocalhost = Boolean(
  window.location.hostname.endsWith('cozy.localhost') ||
    window.location.hostname.endsWith('cozy.tools')
)

export function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `/service-worker.js`

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkLocalhostValidServiceWorker(swUrl)
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl)
      }
    })
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      return registration.update()
    })
    .catch(error => {
      console.error('Error during service worker registration:', error)
    })
}

function checkLocalhostValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' }
  })
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')

      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        // eslint-disable-next-line promise/no-nesting
        navigator.serviceWorker.ready
          .then(registration => registration.unregister())
          .then(() => window.location.reload())
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl)
        if (navigator.userAgent.indexOf('Chrome') === -1) {
          console.log('Testing with Chrome-based navigator is recommended')
        }
      }
    })
    .catch(() =>
      console.log(
        'No internet connection found. App is running in offline mode.'
      )
    )
}
