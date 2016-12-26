import styles from '../styles/nav'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'
import { Link } from 'react-router'

const Nav = ({ t }) => (
  <nav>
    <ul class={styles['fil-nav']}>
      <li class={styles['fil-nav-item']}>
        <Link to='/files' class={styles['fil-cat-files']} activeClassName={styles['active']}>
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

export default translate()(Nav)
