const util = require('util')
const logger = require('./logger')
const exec = util.promisify(require('child_process').exec)

module.exports = async function() {
  if (process.env.vrErrorMsg != '') {
    const message = `Visual Review - Please review screenshots, then restart build. ${
      process.env.vrErrorMsg
    }`
    logger.error(message)
    //do not try to post to git when using locally
    if (
      typeof process.env.TRAVIS_PULL_REQUEST !== 'undefined' &&
      process.env.TRAVIS_PULL_REQUEST
    ) {
      await exec(`yarn run cozy-ci-github "${message}"`)
    }
  }
}
