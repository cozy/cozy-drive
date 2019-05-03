import React from 'react'
import { translate, Icon } from 'cozy-ui/react'

import styles from 'drive/styles/dropzone.styl'

import IconDropZone from 'drive/web/modules/upload/IconDropZone'
const DropzoneTeaser = translate()(({ t, currentFolder }) => (
  <div className={styles['fil-dropzone-teaser']}>
    <div className={styles['fil-dropzone-teaser-claudy']}>
      <Icon icon={IconDropZone} size={40} color="white" />
    </div>
    <div className={styles['fil-dropzone-teaser-content']}>
      <p>{t('Files.dropzone.teaser')}</p>
      <span className={styles['fil-dropzone-teaser-folder']}>
        {(currentFolder && currentFolder.name) || 'Drive'}
      </span>
    </div>
  </div>
))
export default DropzoneTeaser
