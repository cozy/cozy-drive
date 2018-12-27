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
      { from: `src/${app}/targets/vendor/assets`, ignore: ['.gitkeep'] }
    ])
  ]
}
