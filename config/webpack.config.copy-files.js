'use strict'

const CopyPlugin = require('copy-webpack-plugin')

const build = /:production$/.test(process.env.NODE_ENV)

module.exports = {
  plugins: [
    new CopyPlugin([
      { from: 'vendor/assets', ignore: ['.gitkeep'] },
      { from: 'manifest.webapp', transform: transformManifest }
    ])
  ]
}

// Method to modify the manifest slug on dev builds. On production builds the
// manifest should be copied without modification.
//
// For dev builds we use the generic "app" slug to share the same application
// domain for each applications.
function transformManifest(buffer) {
  if (build) {
    return buffer
  }
  const content = JSON.parse(buffer.toString())
  content.slug = "app"
  return JSON.stringify(content, null, '  ')
}
