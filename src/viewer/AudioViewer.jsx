import React from 'react'

import withFileUrl from './withFileUrl'
import styles from './styles'

const AudioViewer = ({ file, url }) => (
  <div className={styles['pho-viewer-audioviewer']}>
    <p className={styles['pho-viewer-filename']}>{file.name}</p>
    <audio src={url} controls="controls" />
  </div>
)

export default withFileUrl(AudioViewer)
