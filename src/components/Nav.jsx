import styles from '../styles/nav'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Link, withRouter } from 'react-router'

const Nav = ({ t, router }) => {
  let isBrowsingFiles = router.location.pathname.match(/^\/files/) !== null
  return (
    <nav>
      <ul class={styles['fil-nav']}>
        <li class={styles['fil-nav-item']}>
          <Link to='/files' class={classNames(styles['fil-cat-files'], { [styles['active']]: isBrowsingFiles })}>
            { t('nav.item_files') }
          </Link>
        </li>
        <li class={styles['fil-nav-item']}>
          <Link to='/recent' class={styles['fil-cat-recent']} activeClassName={styles['active']}>
            { t('nav.item_recent') }
          </Link>
        </li>
        <li class={styles['fil-nav-item']}>
          <Link to='/shared' class={styles['fil-cat-shared']} activeClassName={styles['active']}>
            { t('nav.item_shared') }
          </Link>
        </li>
        <li class={styles['fil-nav-item']}>
          <Link to='/activity' class={styles['fil-cat-activity']} activeClassName={styles['active']}>
            { t('nav.item_activity') }
          </Link>
        </li>
        <li class={styles['fil-nav-item']}>
          <Link to='/trash' class={styles['fil-cat-trash']} activeClassName={styles['active']}>
            { t('nav.item_trash') }
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default translate()(withRouter(Nav))
