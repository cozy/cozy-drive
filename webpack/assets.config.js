const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: `src/drive/assets/icons/icon-type-*.svg`,
        to: 'public/icons/',
        flatten: true
      }
    ])
  ]
}
