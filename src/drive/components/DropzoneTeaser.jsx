import React from 'react'
import { translate } from 'cozy-ui/react'
import styles from '../styles/dropzone'

const DropzoneTeaser = ({ t, currentFolder }) => (
  <div className={styles['fil-dropzone-teaser']}>
    <div className={styles['fil-dropzone-teaser-claudy']} />
    <div className={styles['fil-dropzone-teaser-content']}>
      <p>{t('Files.dropzone.teaser')}</p>
      <span className={styles['fil-dropzone-teaser-folder']}>
        {(currentFolder && currentFolder.name) || 'Drive'}
      </span>
    </div>
  </div>
)

export default translate()(DropzoneTeaser)
