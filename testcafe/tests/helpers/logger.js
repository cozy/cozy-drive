const logger = require('minilog')('testcafe')
require('minilog').enable()
require('minilog').suggest.deny('testcafe', 'debug')

module.exports = logger
