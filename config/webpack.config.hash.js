'use strict'

const path = require('path')
const fs = require('fs')
const mobile = /^mobile/.test(process.env.NODE_ENV)
const outputFolder = mobile ? 'mobile/www' : 'build'

module.exports = {
  plugins: [
    // Extracts Hash in external file for reference
    function () {
      this.plugin('done', (stats) => {
        fs.writeFileSync(
          path.join(__dirname, '..', outputFolder, 'assets.json'),
          `{"hash":"${stats.hash}"}`
        )
      })
    }
  ]
}
