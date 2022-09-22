const path = require('path')
const { DefinePlugin } = require('webpack')
const { target } = require('cozy-scripts/config/webpack.vars')
const pkg = require(path.resolve(__dirname, './package.json'))

const SRC_DIR = path.resolve(__dirname, './src')
const configurationFiles = []

configurationFiles.push(
  require('cozy-scripts/config/webpack.bundle.default.js')
)

configurationFiles.push(
  require('cozy-scripts/config/webpack.config.css-modules')
)

const isDrive = process.env.COZY_APP_SLUG === 'drive'
const isPhotos = process.env.COZY_APP_SLUG === 'photos'

console.log('here')

if (isDrive) configurationFiles.push(require('./webpack/drive.config.js'))

if (isDrive && target === 'mobile')
  configurationFiles.push(require('./webpack/mobile.config.js'))

if (target !== 'mobile')
  configurationFiles.push(require('./webpack/appicon.config.js'))

const extraConfig = {
  module: {
    rules: [
      {
        test: /\.worker(\.entry)\.js$/,
        issuer: { not: [/node_modules\//] }, // we want to use this rule only for the apps webworkers, but not for workers created by dependencies
        use: [
          {
            loader: 'worker-loader',
            options: {
              name: 'public/[name].[hash].worker.js'
            }
          }
        ]
      },
      {
        test: /cozy-bar\/dist\/cozy-bar\.js$/,
        loader: 'imports-loader?css=./cozy-bar.css'
      }
    ]
  },
  resolve: {
    modules: ['node_modules', SRC_DIR],
    alias: {
      'react-cozy-helpers': path.resolve(SRC_DIR, './lib/react-cozy-helpers'),
      'cozy-ui/react': 'cozy-ui/transpiled/react',
      lib: path.resolve(SRC_DIR, './lib/'),
      'react-pdf$': 'react-pdf/dist/entry.webpack.js',
      'react-redux': require.resolve('react-redux')
    }
  },
  plugins: [
    new DefinePlugin({
      __PIWIK_SITEID__: 8,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://matomo.cozycloud.cc'),
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_SLUG__: JSON.stringify(process.env.COZY_APP_SLUG)
    })
  ]
}
configurationFiles.push(extraConfig)

if (
  isPhotos &&
  configurationFiles[0].multiple &&
  configurationFiles[0].multiple.services
) {
  // FIXME: Will be handled correctly by next major version of cozy-scripts
  configurationFiles[0].multiple.services.__mergeStrategy.strategy[
    'resolve.modules'
  ] = 'replace'
  configurationFiles[0].multiple.services.resolve = {
    ...configurationFiles[0].multiple.services.resolve,
    modules: [SRC_DIR, 'node_modules']
  }
  // DO NOT REUSE THIS HACK CODE ABOVE
}

configurationFiles.map(configurationFile => {
  console.log(configurationFile?.module?.rules)
  return configurationFile
})

module.exports = configurationFiles
