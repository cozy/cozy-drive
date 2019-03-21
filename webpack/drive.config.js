const { DefinePlugin } = require('webpack')
const { environment } = require('cozy-scripts/config/webpack.vars.js')
const path = require('path')
const production = environment === 'production'

module.exports = {
  resolve: {
    alias: {
      'cozy-ui/react': 'cozy-ui/transpiled/react'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src'),
          /node_modules\/(copy-text-to-clipboard)/
        ],
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: 'node_modules/.cache/babel-loader/js',
          presets: [['cozy-app', { react: false }]]
        }
      }
    ]
  },
  plugins: [
    new DefinePlugin({
      __PIWIK_SITEID_MOBILE__: 12,
      __PIWIK_DIMENSION_ID_APP__: 1,
      __SENTRY_URL__: JSON.stringify(
        production
          ? 'https://9259817fbb44484b8b7a0a817d968ae4@sentry.cozycloud.cc/6'
          : 'https://29bd1255b6d544a1b65435a634c9ff67@sentry.cozycloud.cc/2'
      )
    })
  ]
}
