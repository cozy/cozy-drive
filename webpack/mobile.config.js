const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: 'src/drive/mobile/assets/fonts/',
        to: 'app/'
      }
    ])
  ]
}
