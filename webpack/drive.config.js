const { DefinePlugin } = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new DefinePlugin({
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
