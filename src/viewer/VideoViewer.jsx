import React from 'react'

import withFileUrl from './withFileUrl'
import styles from './styles'

const VideoViewer = ({ file, url }) => (
  <div data-test-id="viewer-video" className={styles['pho-viewer-videoviewer']}>
    <video src={url} controls="controls" />
    <p className={styles['pho-viewer-filename']}>{file.name}</p>
  </div>
)

export default withFileUrl(VideoViewer)
