const path = require('path')
const { target } = require('cozy-scripts/config/webpack.vars')

const SRC_DIR = path.resolve(__dirname, './src')
const configurationFiles = []

configurationFiles.push(require('cozy-scripts/config/webpack.bundle.preact.js'))

const isDrive = process.env.COZY_APP_SLUG !== 'photos'
const appConfig = isDrive ? require('./webpack/drive.config.js') : require('./webpack/photos.config.js')
configurationFiles.push(appConfig)

if (isDrive && target === 'mobile') configurationFiles.push(require('./webpack/mobile.config.js'))

const extraConfig = {
  resolve: {
    modules: ['node_modules', SRC_DIR],
    alias: {
      'react-cozy-helpers': path.resolve(SRC_DIR, './lib/react-cozy-helpers')
    }
  }
}
configurationFiles.push(extraConfig)

module.exports = configurationFiles
