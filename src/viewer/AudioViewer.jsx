import React from 'react'

import withFileUrl from './withFileUrl'
import styles from './styles'

const AudioViewer = ({ file, url }) => (
  <div data-test-id="viewer-audio" className={styles['pho-viewer-audioviewer']}>
    <p className={styles['pho-viewer-filename']}>{file.name}</p>
    <audio src={url} controls="controls" />
  </div>
)

export default withFileUrl(AudioViewer)
