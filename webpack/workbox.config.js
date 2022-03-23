module.exports = {
  globDirectory: 'build/drive',
  globPatterns: ['**/*.{css,js,html,png,svg}'],
  swDest: 'build/drive/service-worker.js',
  swSrc: 'build/drive/serviceWorker/service-worker/drive.js',
  // the generated build of Drive contains oversized item compared to 2 MB.
  // drive/public/cozy-bar.js is 3.76 MB
  // drive/public/drive.c3e97847e9b927f300c2.js is 5.22 MB
  // drive/vendors/drive.75841a8786e819ae0761.js is 5.1 MB
  // That is bigger than 2 MB default value of workbox InjectManifestOptions' maximumFileSizeToCacheInBytes:
  // https://developer.chrome.com/docs/workbox/reference/workbox-build/#type-WebpackInjectManifestOptions
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
}
