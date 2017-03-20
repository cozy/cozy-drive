import styles from '../styles/topbar'

import React from 'react'
import { translate } from '../lib/I18n'
import { withRouter } from 'react-router'

import Toolbar from '../containers/Toolbar'

export const Topbar = ({ t, router, viewName, albumName = '' }) => {
  const backToAlbums = () => {
    // go to parent
    let url = router.location.pathname
    router.push(url.substring(0, url.lastIndexOf('/')))
  }
  return <div className={styles['pho-content-header']}>
    {viewName === 'albumContent' &&
      <div
        role='button'
        className={styles['pho-content-album-previous']}
        onClick={backToAlbums}
      />
    }
    <h2 className={styles['pho-content-title']}>
      {viewName === 'albumContent' ? albumName : t(`Nav.${viewName}`)}
    </h2>
    <Toolbar viewName={viewName} />
  </div>
}

export default translate()(withRouter(Topbar))
