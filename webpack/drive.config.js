const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: `src/assets/onlyOffice`,
        to: 'onlyOffice'
      }
    ])
  ]
}
