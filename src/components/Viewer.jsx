import styles from '../styles/viewer'

import React from 'react'
import { translate } from '../lib/I18n'

import { STACK_FILES_DOWNLOAD_PATH } from '../constants/config'

import ViewerToolbar from '../containers/ViewerToolbar'

export const Viewer = ({ t, photoId }) => (
  <div className={styles['pho-viewer-wrapper']} role='viewer'>
    <ViewerToolbar />
    <div className={styles['pho-viewer-content']}>
      <div className={styles['photo-viewer-nav-previous']} />
      <div className={styles['pho-viewer-photo']}>
        <img
          src={`${STACK_FILES_DOWNLOAD_PATH}/${photoId}`}
        />
      </div>
      <div className={styles['photo-viewer-nav-next']} />
    </div>
  </div>
)

export default translate()(Viewer)
