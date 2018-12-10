const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const configs = require('cozy-scripts/config/webpack.bundle.preact.js')

const SRC_DIR = path.resolve(__dirname, './src')
const customConfig = {
  resolve: {
    modules: ['node_modules', SRC_DIR],
    alias: {
      'react-cozy-helpers': path.resolve(SRC_DIR, './lib/react-cozy-helpers')
    }
  },
  entry: {
    public: [require.resolve('babel-polyfill'), path.resolve(SRC_DIR, './drive/targets/public/index.jsx')]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_DIR, './drive/targets/public/index.ejs'),
      title: `Drive public`,
      filename: 'public/index.html',
      inject: false,
      chunks: ['vendors', 'public'],
      minify: {
        collapseWhitespace: true
      }
    })
  ]
};

module.exports = [configs, customConfig]
