// TODO: move it to the alerter duck in cozy-ui
function FormattedError (message, messageData) {
  this.name = 'FormattedError'
  this.message = message
  this.messageData = messageData
  this.stack = (new Error()).stack
}
FormattedError.prototype = Object.create(Error.prototype)
FormattedError.prototype.constructor = FormattedError

export default FormattedError
