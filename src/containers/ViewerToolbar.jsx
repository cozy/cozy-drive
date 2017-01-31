import styles from '../styles/viewerToolbar'

import React from 'react'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'

export const ViewerToolbar = ({ t, router }) => {
  const closeViewer = () => {
    // go to parent
    let url = router.location.pathname
    router.push(url.substring(0, url.lastIndexOf('/')))
  }
  return (
    <div className={styles['pho-viewer-toolbar']} role='viewer-toolbar'>
      <div className={styles['pho-viewer-toolbar-actions']} />
      <div
        className={styles['pho-viewer-toolbar-close']}
        onClick={closeViewer}
      >
        <div className={styles['pho-viewer-toolbar-close-cross']} />
        <span className={styles['pho-viewer-toolbar-close-text']}>
          {t('Viewer.close')}
        </span>
      </div>
    </div>
  )
}

export default translate()(withRouter(ViewerToolbar))
