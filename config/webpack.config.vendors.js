'use strict'

const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin([
      { from: 'vendor/assets/app-icon.svg', to: 'public/app-icon.svg' },
      { from: 'vendor/assets', ignore: ['.gitkeep'] }
    ])
  ]
}
