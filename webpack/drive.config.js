const path = require('path')
const { DefinePlugin } = require('webpack')

module.exports = {
  plugins: [
    new DefinePlugin({
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __SENTRY_URL__: JSON.stringify(
        'https://29bd1255b6d544a1b65435a634c9ff67@sentry.cozycloud.cc/2'
      )
    }),
  ]
}
