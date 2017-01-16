'use strict'

const path = require('path')
const fs = require('fs')

module.exports = {
  plugins: [
    // Extracts Hash in external file for reference
    function () {
      this.plugin('done', (stats) => {
        fs.writeFileSync(
          path.join(__dirname, '../build/assets.json'),
          `{"hash":"${stats.hash}"}`
        )
      })
    }
  ]
}
