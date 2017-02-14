'use strict'

const path = require('path')
const fs = require('fs')

const {target} = require('./webpack.vars')
const targetConfig = require(`./webpack.target.${target}`)

module.exports = {
  plugins: [
    // Extracts Hash in external file for reference
    function () {
      this.plugin('done', (stats) => {
        fs.writeFileSync(
          path.join(targetConfig.output.path, 'assets.json'),
          `{"hash":"${stats.hash}"}`
        )
      })
    }
  ]
}
