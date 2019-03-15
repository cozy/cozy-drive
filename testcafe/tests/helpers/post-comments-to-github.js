const util = require('util')
const exec = util.promisify(require('child_process').exec)

module.exports = async function(message) {
  await exec(`yarn run cozy-ci-github "${message}"`)
}
