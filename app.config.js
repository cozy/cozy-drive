const path = require('path')
const { DefinePlugin } = require('webpack')
const { target } = require('cozy-scripts/config/webpack.vars')
const pkg = require(path.resolve(__dirname, './package.json'))

const SRC_DIR = path.resolve(__dirname, './src')
const configurationFiles = []

configurationFiles.push(require('cozy-scripts/config/webpack.bundle.preact.js'))

configurationFiles.push(require('cozy-scripts/config/webpack.config.css-modules'))

const isDrive = process.env.COZY_APP_SLUG === 'drive'
if (isDrive) configurationFiles.push(require('./webpack/drive.config.js'))

if (isDrive && target === 'mobile') configurationFiles.push(require('./webpack/mobile.config.js'))

const extraConfig = {
  resolve: {
    modules: ['node_modules', SRC_DIR],
    alias: {
      'react-cozy-helpers': path.resolve(SRC_DIR, './lib/react-cozy-helpers'),
      'create-react-class': path.resolve('node_modules', 'preact-compat/lib/create-react-class')
    }
  },
  plugins: [
    new DefinePlugin({
      __PIWIK_SITEID__: 8,
      __PIWIK_TRACKER_URL__: JSON.stringify('https://matomo.cozycloud.cc'),
      __APP_VERSION__: JSON.stringify(pkg.version)
    }),
  ]
}
configurationFiles.push(extraConfig)

module.exports = configurationFiles
