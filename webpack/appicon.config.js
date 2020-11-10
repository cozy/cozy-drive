const CopyPlugin = require('copy-webpack-plugin')
const isDrive = process.env.COZY_APP_SLUG === 'drive'

const app = isDrive ? 'drive' : 'photos'
module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: `src/${app}/targets/vendor/assets/app-icon.svg`,
        to: 'public/app-icon.svg'
      },
      {
        from: `src/${app}/targets/vendor/assets/favicon*`,
        to: 'public/',
        flatten: true
      },
      {
        from: `src/${app}/targets/vendor/assets/apple-touch-icon.png`,
        to: 'public/apple-touch-icon.png'
      },
      {
        from: `src/${app}/targets/vendor/assets/safari-pinned-tab.svg`,
        to: 'public/safari-pinned-tab.svg'
      },
      { from: `src/${app}/targets/vendor/assets`, ignore: ['.gitkeep'] }
    ])
  ]
}
