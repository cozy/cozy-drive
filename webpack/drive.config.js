const { DefinePlugin } = require('webpack')
const { environment } = require('cozy-scripts/config/webpack.vars.js')
const CopyPlugin = require('copy-webpack-plugin')

const production = environment === 'production'

module.exports = {
  plugins: [
    new DefinePlugin({
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __SENTRY_URL__: JSON.stringify(
        production
          ? 'https://9259817fbb44484b8b7a0a817d968ae4@sentry.cozycloud.cc/6'
          : 'https://29bd1255b6d544a1b65435a634c9ff67@sentry.cozycloud.cc/2'
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
