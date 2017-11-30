import React, { Component } from 'react'
import { getDownloadLink } from 'cozy-client'
import Spinner from 'cozy-ui/react/Spinner'

import styles from './styles'

export default class AudioViewer extends Component {
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
      <div className={styles['pho-viewer-audioviewer']}>
        <p>{file.name}</p>
        {fileDownloadUrl && <audio src={fileDownloadUrl} controls="controls" />}
        {!fileDownloadUrl && (
          <Spinner size="xxlarge" middle="true" noMargin color="white" />
        )}
      </div>
    )
  }
}
