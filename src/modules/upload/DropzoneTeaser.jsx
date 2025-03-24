import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from '@/styles/dropzone.styl'

const DropzoneTeaser = translate()(({ t, currentFolder }) => (
  <div className={styles['fil-dropzone-teaser']}>
    <div className={styles['fil-dropzone-teaser-claudy']}>
      <Icon icon={UploadIcon} size={24} color="var(--white)" />
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
