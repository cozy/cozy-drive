import React from 'react'
import { Icon } from 'cozy-ui/transpiled/react'

import withFileUrl from './withFileUrl'
import styles from './styles'
import AudioIcon from './icons/icon-type-audio.svg'

const AudioViewer = ({ file, url }) => (
  <div data-test-id="viewer-audio" className={styles['pho-viewer-audioviewer']}>
    <Icon icon={AudioIcon} width={160} height={140} />
    <p className={styles['pho-viewer-filename']}>{file.name}</p>
    <audio src={url} controls="controls" />
  </div>
)

export default withFileUrl(AudioViewer)
