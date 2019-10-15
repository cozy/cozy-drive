import React from 'react'
import { withClient } from 'cozy-client'
import PropTypes from 'prop-types'
import { CozyFile } from 'cozy-doctypes'

import ScannerQualification from './ScannerQualification'
import { Modal } from 'cozy-ui/transpiled/react'

import withOffline from './withOffline'

export const SCANNER_IDLE = 'idle'
export const SCANNER_DONE = 'done'
export const SCANNER_UPLOADING = 'uploading'
/**
 * LoadingScreen is used to create a better transition between
 * the native camera and the Qualification Modale.
 *
 * This Overlay has to be in a Modal since the menu item can be
 * closed
 *
 */
class Scanner extends React.Component {
  state = {
    status: SCANNER_IDLE,
    error: null,
    filename: '',
    shouldShowScannerQualification: false,
    imageURI: '',
    loadingScreen: false
  }
  constructor(props) {
    super(props)
    if (!CozyFile.cozyClient) CozyFile.registerClient(this.props.client)
  }

  /**
   *
   * @param {String} imageURI native path to the file (file:///var....)
   */
  onSuccess = async imageURI => {
    this.setState({
      error: null,
      loadingScreen: false,
      shouldShowScannerQualification: true,
      imageURI
    })
  }

  onUpload = async (imageURI, qualification, filename = '') => {
    const { generateName } = this.props
    const name = filename === '' ? generateName() : filename
    this.setState({ status: SCANNER_UPLOADING, filename: name })
    const { dirId, onConflict, onBeforeUpload, onFinish } = this.props
    const onResolvedLocalFS = async fileEntry => {
      fileEntry.file(
        file => {
          const reader = new FileReader()
          reader.onloadend = async () => {
            //we get the of the readAsBuffer in the `result` attr
            try {
              if (onBeforeUpload) onBeforeUpload()
              const newFile = await this.uploadFileWithConflictStrategy(
                name,
                reader.result,
                dirId,
                onConflict,
                qualification
              )
              //It's possible that the filename as changed, so let's update it
              if (onConflict === 'rename') {
                this.setState({ filename: newFile.data.name })
              }

              if (onFinish) onFinish()
            } catch (error) {
              this.setState({ error })
            } finally {
              this.setState({ status: SCANNER_DONE })
            }
          }
          // Read the file as an ArrayBuffer
          reader.readAsArrayBuffer(file)
        },
        err => {
          this.setState({ error: err })
          this.setState({ status: SCANNER_DONE })
          console.error('error getting fileentry file!' + err)
        }
      )
    }

    const onError = error => {
      this.setState({ error })
      this.setState({ status: SCANNER_DONE })
    }
    /**
     * file:/// can not be converted to a fileEntry without the Cordova's File plugin.
     * `resolveLocalFileSystemURL` is provided by this plugin and can resolve the native
     * path to a fileEntry readable by a `FileReader`
     *
     * When we finished to read the fileEntry as buffer, we start the upload process
     *
     */

    window.resolveLocalFileSystemURL(imageURI, onResolvedLocalFS, onError)
  }
  //TODO Put this in Files Doctypes
  /**
   *
   * @param {String} name File Name
   * @param {ArrayBuffer} file data
   * @param {String} dirId dir id when to upload
   * @param {String} onConflict Actually only 2 hardcoded strategies 'erase' or 'rename'
   * @param {Object} metadata An object containing the wanted metadata to attach
   */
  async uploadFileWithConflictStrategy(
    name,
    file,
    dirId,
    onConflict,
    metadata
  ) {
    const { client } = this.props
    const filesCollection = client.collection('io.cozy.files')

    const path = await CozyFile.getFullpath(dirId, name)
    try {
      const existingFile = await filesCollection.statByPath(path)
      const { id: fileId, dir_id: dirId } = existingFile.data
      if (onConflict === 'erase') {
        //!TODO Bug Fix. Seems we have to pass a name attribute ?!
        const resp = await filesCollection.updateFile(file, {
          dirId,
          fileId,
          name,
          metadata
        })
        return resp
      } else {
        const { filename, extension } = CozyFile.splitFilename({
          name,
          type: 'file'
        })
        const newFileName =
          CozyFile.generateNewFileNameOnConflict(filename) + extension
        //recall itself with the newFilename.
        return this.uploadFileWithConflictStrategy(
          newFileName,
          file,
          dirId,
          onConflict,
          metadata
        )
      }
    } catch (error) {
      if (/Not Found/.test(error)) {
        return await this.upload(name, file, dirId, metadata)
      }
      throw error
    }
  }
  async upload(name, file, dirId, metadata) {
    const { client } = this.props

    return client.collection('io.cozy.files').createFile(file, {
      name,
      dirId,
      contentType: 'image/jpeg',
      lastModifiedDate: new Date(),
      metadata
    })
  }
  onFail = message => {
    this.setState({ loadingScreen: false })
    console.log('failed', message)
  }
  startScanner = () => {
    try {
      //
      this.setState({ loadingScreen: true })
      this.defaultPluginConfig = {
        quality: 80,
        destinationType: window.navigator.camera.DestinationType.FILE_URI,
        sourceTypes: window.navigator.camera.PictureSourceType.CAMERA,
        correctOrientation: true
      }

      window.navigator.camera.getPicture(this.onSuccess, this.onFail, {
        ...this.defaultPluginConfig,
        ...this.props.pluginConfig
      })
    } catch (e) {
      console.error('You have to install cordova camera plugin', e)
    }
  }

  onClear = () => {
    this.setState({ filename: undefined })
  }
  /**
   * Si pas de dirId => FilePicker
   */
  render() {
    const { children, isOffline } = this.props
    const {
      status,
      error,
      filename,
      shouldShowScannerQualification,
      imageURI,
      loadingScreen
    } = this.state
    if (loadingScreen) {
      return (
        <Modal
          mobileFullscreen
          closable={false}
          className="u-bg-black u-mih-100"
        />
      )
    }
    if (shouldShowScannerQualification)
      return (
        <ScannerQualification
          onSave={async (qualification, filename) => {
            this.setState({ shouldShowScannerQualification: false })
            return await this.onUpload(imageURI, qualification, filename)
          }}
          dismissAction={() => {
            window.navigator.camera.cleanup(() => {}, () => {})
            this.setState({ shouldShowScannerQualification: false })
          }}
        />
      )
    return (
      <>
        {children({
          error,
          status,
          filename,
          startScanner: this.startScanner,
          onClear: this.onClear,
          online: !isOffline
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

Scanner.propTypes = {
  isOffline: PropTypes.bool.isRequired
}
export default withOffline(withClient(Scanner))
