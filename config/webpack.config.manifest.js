'use strict'

const CopyPlugin = require('copy-webpack-plugin')

module.exports = function(production, app) {
  // Method to modify the manifest slug on dev builds. On production builds the
  // manifest should be copied without modification.
  //
  // For dev builds we use the generic "app" slug to share the same application
  // domain for each applications.
  function transformManifest(buffer) {
    if (production) {
      return buffer
    }

    const content = JSON.parse(buffer.toString())
    content.slug = 'app'
    return JSON.stringify(content, null, '  ')
  }

  return {
    plugins: [
      new CopyPlugin([
        {
          from: `targets/${app}/manifest.webapp`,
          transform: transformManifest
        },
        { from: 'README.md' },
        { from: 'LICENSE' },
        {
          from: 'targets/.travis.yml'
        }
      ])
    ]
  }
}
