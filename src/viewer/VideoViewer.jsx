import React, { Component } from 'react'
import { getDownloadLink } from 'cozy-client'
import Spinner from 'cozy-ui/react/Spinner'

import styles from './styles'

export default class VideoViewer extends Component {
  state = {
    fileDownloadUrl: null
  }

  componentWillMount() {
    getDownloadLink(this.props.file).then(url =>
      this.setState({ fileDownloadUrl: url })
    )
  }

  render() {
    const { file } = this.props
    const { fileDownloadUrl } = this.state
    return (
      <div className={styles['pho-viewer-videoviewer']}>
        {fileDownloadUrl && <video src={fileDownloadUrl} controls="controls" />}
        {fileDownloadUrl && (
          <p className={styles['pho-viewer-filename']}>{file.name}</p>
        )}
        {!fileDownloadUrl && (
          <Spinner size="xxlarge" middle="true" noMargin color="white" />
        )}
      </div>
    )
  }
}
