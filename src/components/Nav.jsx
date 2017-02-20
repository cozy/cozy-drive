/* global __TARGET__ */

import styles from '../styles/nav'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'
import { Link, withRouter } from 'react-router'

const Nav = ({ t, router }) => {
  let isBrowsingFiles = router.location.pathname.match(/^\/files/) !== null
  let isBrowsingTrash = router.location.pathname.match(/^\/trash/) !== null
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
          <Link to='/trash' class={classNames(styles['fil-cat-trash'], { [styles['active']]: isBrowsingTrash })}>
            { t('nav.item_trash') }
          </Link>
        </li>
        {__TARGET__ === 'mobile' &&
        <li class={styles['fil-nav-item']}>
          <Link to='/settings' class={styles['fil-cat-settings']} activeClassName={styles['active']}>
            { t('nav.item_settings') }
          </Link>
        </li>
        }
      </ul>
    </nav>
  )
}

export default translate()(withRouter(Nav))
