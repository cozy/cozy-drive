import React from 'react'
import { translate } from 'cozy-ui/react'
import styles from '../styles/dropzone'

const DropzoneTeaser = (t, currentFolderName) => (
  <div className={styles['fil-dropzone-teaser']}>
    <div className={styles['fil-dropzone-teaser-claudy']} />
    <div className={styles['fil-dropzone-teaser-content']}>
      <p>Drop files to upload them to:</p>
      <span className={styles['fil-dropzone-teaser-folder']}>
        {currentFolderName}
      </span>
    </div>
  </div>
)

export default translate()(DropzoneTeaser)
