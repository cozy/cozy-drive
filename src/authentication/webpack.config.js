const path = require('path')
const baseConfig = require('../../config/webpack.config.base')
const preactConfig = require('../../config/webpack.config.preact')
const uiConfig = require('../../config/webpack.config.cozy-ui')
const nodeExternals = require('webpack-node-externals')
const merge = require('webpack-merge')

module.exports = ({ production } = {}) => {
  const disableExtract = function(uiConfig) {
    const loader = uiConfig.module.rules[0].loader
    if (loader[0].loader.indexOf('extract-text-webpack-plugin') > -1) {
      uiConfig.module.rules[0].loader = loader.slice(1)
    }
    return uiConfig
  }

  const uiConfigNoExtract = disableExtract(uiConfig(production))

  return merge(preactConfig, uiConfigNoExtract, {
    entry: {
      index: './Standalone.jsx'
    },
    output: {
      path: path.resolve(__dirname, './build'),
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    resolve: baseConfig().resolve,
    stats: { chunks: false, modules: false },
    devtool: production ? false : 'source-map',
    externals: [
      nodeExternals({
        modulesDir: path.resolve('../../node_modules'),
        importType: 'commonjs2'
      })
    ]
  })
}
