import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('install', () => {
  self.skipWaiting()

  // Perform any other actions required for your
  // service worker to install, potentially inside
  // of event.waitUntil();
})

// I choose https://developer.chrome.com/docs/workbox/the-ways-of-workbox/#workbox-cli
// but we can integrate Workbox another way
// using Webpack build process, thanks to generateSW or injectManifest
// this can be done after this story's validation
