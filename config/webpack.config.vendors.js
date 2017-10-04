'use strict'

const CopyPlugin = require('copy-webpack-plugin')

module.exports = function(production, app) {
  return {
    plugins: [
      new CopyPlugin([
        {
          from: `targets/${app}/vendor/assets/app-icon.svg`,
          to: 'public/app-icon.svg'
        },
        { from: `targets/${app}/vendor/assets`, ignore: ['.gitkeep'] }
      ])
    ]
  }
}
