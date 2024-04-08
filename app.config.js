const path = require('path')

const { DefinePlugin } = require('webpack')

const { target } = require('cozy-scripts/config/webpack.vars')
const pkg = require(path.resolve(__dirname, './package.json'))

const SRC_DIR = path.resolve(__dirname, './src')
const configurationFiles = []

configurationFiles.push(
  require('cozy-scripts/config/webpack.bundle.default.js')
)

configurationFiles.push(
  require('cozy-scripts/config/webpack.config.css-modules')
)

configurationFiles.push(require('./webpack/drive.config.js'))

if (target === 'browser') {
  configurationFiles.push(require('./webpack/assets.config.js'))
}

configurationFiles.push(require('./webpack/appicon.config.js'))

const extraConfig = {
  module: {
    rules: [
      {
        test: /\.worker(\.entry)\.js$/,
        issuer: { not: [/node_modules\//] }, // we want to use this rule only for the apps webworkers, but not for workers created by dependencies
        use: [
          {
            loader: 'worker-loader',
            options: {
              name: 'public/[name].[hash].worker.js'
            }
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules', SRC_DIR],
    alias: {
      'react-cozy-helpers': path.resolve(SRC_DIR, './lib/react-cozy-helpers'),
      'cozy-ui/react': 'cozy-ui/transpiled/react',
      lib: path.resolve(SRC_DIR, './lib/'),
      'react-pdf$': 'react-pdf/dist/esm/entry.webpack',
      'react-redux': require.resolve('react-redux')
    }
  },
  plugins: [
    new DefinePlugin({
      __APP_VERSION__: JSON.stringify(pkg.version),
      __APP_SLUG__: JSON.stringify(process.env.COZY_APP_SLUG)
    })
  ]
}
configurationFiles.push(extraConfig)

module.exports = configurationFiles
