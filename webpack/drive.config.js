const { DefinePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /cozy-bar\/dist\/cozy-bar\.js$/,
        loader: 'imports-loader?css=./cozy-bar.css'
      }
    ]
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
