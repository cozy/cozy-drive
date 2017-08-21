import styles from '../styles/viewerToolbar'
import classNames from 'classnames'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { withRouter } from 'react-router'
import { downloadFile } from '../lib/redux-cozy-client'

export const ViewerToolbar = ({ t, router, hidden, currentPhoto }) => {
  const closeViewer = () => {
    // go to parent
    let url = router.location.pathname
    router.push({
      pathname: url.substring(0, url.lastIndexOf('/')),
      query: router.location.query
    })
  }
  return (
    <div className={classNames(styles['pho-viewer-toolbar'], {[styles['--hidden']]: hidden})} role='viewer-toolbar'>
      <div className={classNames(styles['coz-selectionbar'], styles['pho-viewer-toolbar-actions'])}>
        <button
          className={styles['coz-action-download']}
          onClick={() => downloadFile(currentPhoto)}
          >
          {t('Viewer.actions.download')}
        </button>
      </div>
      <div
        className={styles['pho-viewer-toolbar-close']}
        onClick={closeViewer}
        title={t('Viewer.close')}
      >
        <div className={styles['pho-viewer-toolbar-close-cross']} />
      </div>
    </div>
  )
}

export default translate()(withRouter(ViewerToolbar))
