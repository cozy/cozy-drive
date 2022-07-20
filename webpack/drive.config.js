const path = require('path')
const { DefinePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

const mapToNodeModules = packages => {
  const res = {}
  packages.forEach(pkgName => {
    res[pkgName] = path.resolve(__dirname, `../node_modules/${pkgName}`)
  })
  return res
}

module.exports = {
  resolve: {
    alias: {
      // Resolving manually package that have multiple versions. They emit warnings with
      // DuplicatePackageChecker plugin. We always use the node_modules version.
      // https://github.com/darrenscerri/duplicate-package-checker-webpack-plugin#resolving-duplicate-packages-in-your-bundle
      ...mapToNodeModules([
        '@babel/runtime',
        'cozy-device-helper',
        'cozy-doctypes',
        'cozy-logger',
        'cozy-device-helper',
        'filesize',
        'has-symbols',
        'immediate',
        'inherits',
        'is-callable',
        'object-assign',
        'pouchdb-adapter-utils',
        'pouchdb-binary-utils',
        'pouchdb-collections',
        'pouchdb-errors',
        'pouchdb-json',
        'pouchdb-md5',
        'pouchdb-merge',
        'pouchdb-utils',
        'react-is',
        'redux',
        'spark-md5',
        'unist-util-visit-parents',
        'uuid',
        'warning'
      ])
    }
  },
  plugins: [
    new DefinePlugin({
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __SENTRY_URL__: JSON.stringify(
        'https://05f3392b39bb4504a179c95aa5b0e8f6@errors.cozycloud.cc/41'
      )
    }),
    new CopyPlugin([
      {
        from: `src/drive/assets/onlyOffice`,
        to: 'onlyOffice'
      }
    ])
  ]
}
