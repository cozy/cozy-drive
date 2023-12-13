const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyPlugin([
      {
        from: `src/drive/targets/vendor/assets/app-icon.svg`,
        to: 'public/app-icon.svg'
      },
      {
        from: `src/drive/targets/vendor/assets/favicon*`,
        to: 'public/',
        flatten: true
      },
      {
        from: `src/drive/targets/vendor/assets/apple-touch-icon.png`,
        to: 'public/apple-touch-icon.png'
      },
      {
        from: `src/drive/targets/vendor/assets/safari-pinned-tab.svg`,
        to: 'public/safari-pinned-tab.svg'
      },
      { from: `src/drive/targets/vendor/assets`, ignore: ['.gitkeep'] }
    ])
  ]
}
