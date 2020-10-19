require('log-prefix')(function() {
  return '%s [' + new Date().toTimeString() + ']'
})
const logger = require('@cozy/minilog')('testcafe')
require('minilog').enable()
require('minilog').suggest.deny('testcafe', 'debug')

module.exports = logger
