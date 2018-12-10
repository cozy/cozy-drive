const path = require('path')
const baseConfig = require('cozy-scripts/config/webpack.bundle.preact.js')

const isDrive = process.env.COZY_APP_SLUG !== 'photos'
const appConfig = isDrive ? require('./webpack/drive.config.js') : require('./webpack/photos.config.js')

const SRC_DIR = path.resolve(__dirname, './src')
const extraConfig = {
  resolve: {
    modules: ['node_modules', SRC_DIR],
    alias: {
      'react-cozy-helpers': path.resolve(SRC_DIR, './lib/react-cozy-helpers')
    }
  }
};

module.exports = [baseConfig, extraConfig, appConfig]
