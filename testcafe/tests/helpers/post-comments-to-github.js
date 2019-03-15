const exec = require('child_process').exec

module.exports = function(message) {
  exec(`"./scripts/github.sh" "${message}"`, function(error) {
    if (error !== null) {
      console.log('exec error: ' + error)
    }
  })
}
