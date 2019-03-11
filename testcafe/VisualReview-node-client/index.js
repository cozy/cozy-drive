const request = require('request')
const fs = require('fs')
const url = require('url')
const EOL = require('os')
const defaultOptions = require('./defaultOptions')

const API_VERSION = '1'

class VisualReviewClient {
  constructor(options) {
    this._createdRun = {}

    this.options = Object.assign(defaultOptions, options)
  }

  _log(message, objectDump) {
    if (this.options.debug) {
      if (objectDump) {
        message += ' %j'
        console.log(message, objectDump)
      } else {
        console.log(message)
      }
    }
  }

  _callServer(method, path, body, formData) {
    const options = this.options

    return new Promise((resolve, reject) => {
      let requestOptions = {
        method: method,
        uri: url.format({
          protocol: options.protocol,
          hostname: options.hostname,
          //port: options.port,
          pathname: '/api/' + path
        })
      }

      if (body) {
        Object.assign(requestOptions, { body, json: true })
      }

      Object.assign(requestOptions, { formData })

      this._log(method + ' ' + requestOptions.uri + EOL, requestOptions)
      request(requestOptions, (error, response, body) => {
        const statusCode = response.statusCode
        console.log(`statusCode : ${statusCode}`)
        if (error || (statusCode >= 400 && statusCode < 600)) {
          this._log('ERROR for request', { error, response, body })
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  }

  _checkServerApiVersion() {
    return this._callServer('GET', 'version').then(result => {
      if (result !== API_VERSION) {
        this._log(
          `WARNING! Server's API version is ${result}. Expecting version: ${API_VERSION}`
        )
      }
    })
  }

  _createRun(projectName, suiteName) {
    return this._callServer('POST', 'runs', { projectName, suiteName }).then(
      result => {
        this._createdRun = result

        if (result.id) {
          this._log(`Created run with ID ${result.id}`)
        } else {
          throw new Error(
            'VisualReview server returned an empty run id when creating a new run. ' +
              'Probably something went wrong with the server.'
          )
        }
      },
      error => {
        throw new Error(
          'Received error response from VisualReview server: ' + error
        )
      }
    )
  }

  start() {
    const options = this.options

    return this._checkServerApiVersion()
      .then(() => {
        return this._createRun(options.projectName, options.suiteName)
      })
      .catch(error => {
        throw new Error(
          'VisualReview: an error occured while initializing a run: ' + error
        )
      })
  }

  uploadScreenshot(fileName) {
    this._log(`Start uploading ${fileName}`)

    return new Promise(resolve => {
      fs.readFile(fileName, (error, image) => {
        if (error) {
          throw new Error(`Error while reading file: ${fileName}`)
        }
        const formData = Object.assign({
          file: {
            value: image,
            options: {
              filename: fileName,
              contentType: 'image/png'
            }
          },
          screenshotName: fileName,
          meta: JSON.stringify(this.options.meta),
          properties: JSON.stringify(this.options.properties)
        })
        this._callServer(
          'POST',
          `runs/${this._createdRun.id}/screenshots`,
          null,
          formData
        )
          .then(resolve)
          .catch(error => {
            throw new Error('Error while uploading screenshot ' + error)
          })
      })
    })
  }
}

module.exports = VisualReviewClient
