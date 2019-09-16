import React from 'react'

import { withClient } from 'cozy-client'

import { CozyFile } from 'cozy-doctypes'

//TODO Put this in File Doctypes
export const generateNewFileName = filename => {
  //Check if the string ends by _1
  const regex = new RegExp('(_)([0-9]+)$')
  const matches = filename.match(regex)
  if (matches) {
    let versionNumber = matches[2]
    //increment versionNumber
    versionNumber++
    const newFilename = filename.replace(
      new RegExp('(_)([0-9]+)$'),
      `_${versionNumber}`
    )
    return newFilename
  } else {
    return `${filename}_1`
  }
}

class Scanner extends React.Component {
  state = {
    status: 'iddle',
    error: null,
    name: ''
  }
  constructor(props) {
    super(props)
    if (!CozyFile.cozyClient) CozyFile.registerClient(this.props.client)
  }

  componentDidMount() {}
  /**
   *
   * @param {String} imageURI native path to the file (file:///var....)
   */
  onSuccess = async imageURI => {
    const { generateName, dirId, onConflict } = this.props
    const name = generateName()

    this.setState({ error: null })
    /**
     * file:/// can not be converted to a fileEntry without the Cordova's File plugin.
     * `resolveLocalFileSystemURL` is provided by this plugin and can resolve the native
     * path to a fileEntry readable by a `FileReader`
     *
     * When we finished to read the fileEntry as buffer, we start the upload process
     *
     */

    window.resolveLocalFileSystemURL(
      imageURI,
      async fileEntry => {
        fileEntry.file(
          file => {
            const reader = new FileReader()
            reader.onloadend = async () => {
              //we get the of the readAsBuffer in the `result` attr
              try {
                await this.uploadFileWithConflictStrategy(
                  name,
                  reader.result,
                  dirId,
                  onConflict
                )
              } catch (error) {
                this.setState({ error })
              } finally {
                this.setState({ status: 'done' })
              }
            }
            this.setState({ status: 'uploading' })
            // Read the file as an ArrayBuffer
            reader.readAsArrayBuffer(file)
          },
          err => {
            this.setState({ error: err })
            this.setState({ status: 'done' })
            console.error('error getting fileentry file!' + err)
          }
        )
      },
      error => {
        this.setState({ error })
        this.setState({ status: 'done' })
      }
    )
  }

  //TODO Put this in Files Doctypes
  /**
   *
   * @param {String} name File Name
   * @param {ArrayBuffer} file data
   * @param {String} dirId dir id when to upload
   * @param {String} onConflict Actually only 2 hardcoded strategies 'erase' or 'rename'
   */
  async uploadFileWithConflictStrategy(name, file, dirId, onConflict) {
    this.setState({ name })
    const { client } = this.props
    const filesCollection = client.collection('io.cozy.files')
    let path = await CozyFile.getFullpath(dirId, '')
    if (!path.endsWith('/')) path = path + '/'
    try {
      const existingFile = await filesCollection.statByPath(path + name)
      const { id: fileId, dir_id: dirId } = existingFile.data
      if (onConflict === 'erase') {
        //!TODO Bug Fix. Seems we have to pass a name attribute ?!
        const resp = await filesCollection.updateFile(file, {
          dirId,
          fileId,
          name
        })
        return resp
      } else {
        const { filename, extension } = CozyFile.splitFilename({
          name,
          type: 'file'
        })
        const newFileName = generateNewFileName(filename) + extension
        //recall itself with the newFilename.
        return this.uploadFileWithConflictStrategy(
          newFileName,
          file,
          dirId,
          onConflict
        )
      }
    } catch (error) {
      if (/Not Found/.test(error)) {
        this.upload(name, file, dirId)
      } else {
        console.log('error', error)
        this.setState({ error })
      }
    }
  }
  async upload(name, file, dirId) {
    const { client } = this.props

    return client
      .collection('io.cozy.files')
      .createFile(file, { name, dirId, contentType: 'image/jpeg' })
  }
  onFail(message) {
    alert('Failed because: ' + message)
  }
  onClick = () => {
    this.defaultPluginConfig = {
      quality: 70,
      destinationType: window.navigator.camera.DestinationType.FILE_URI,
      sourceTypes: window.navigator.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }

    window.navigator.camera.getPicture(this.onSuccess, this.onFail, {
      ...this.defaultPluginConfig,
      ...this.props.pluginConfig
    })
  }
  /**
   * Si pas de dirId => FilePicker
   */
  render() {
    const { children } = this.props
    const { status, error } = this.state
    return (
      <>
        {children({
          error,
          status,
          name,
          onClick: this.onClick
        })}
      </>
    )
  }
}

Scanner.defaultProps = {
  pluginConfig: {}
}
/**
 *
 */

Scanner.propTypes = {}
export default withClient(Scanner)
