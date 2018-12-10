const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, '../src')

module.exports = {
  entry: {
    public: [require.resolve('babel-polyfill'), path.resolve(SRC_DIR, './drive/targets/public/index.jsx')]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_DIR, './drive/targets/public/index.ejs'),
      title: 'Cozy Drive',
      filename: 'public/index.html',
      inject: false,
      chunks: ['vendors', 'public'],
      minify: {
        collapseWhitespace: true
      }
    })
  ]
}
