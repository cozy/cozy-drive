/* global __TARGET__ */
if (__TARGET__ === 'browser') {
  module.exports = require('./configureStore.browser')
} else {
  module.exports = require('./configureStore.mobile')
}
