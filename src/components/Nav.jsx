import styles from '../styles/nav'

import React from 'react'
import { translate } from '../lib/I18n'
import { Link } from 'react-router'

export const Nav = ({ t }) => (
  <nav>
    <ul className={styles['coz-nav']}>
      <li className={styles['coz-nav-item']}>
        <Link to='/photos' className={styles['pho-cat-photos']} activeClassName={styles['active']}>
          { t('Nav.photos') }
        </Link>
      </li>
      <li className={styles['coz-nav-item']}>
        <Link to='/albums' className={styles['pho-cat-albums']} activeClassName={styles['active']}>
          { t('Nav.albums') }
        </Link>
      </li>
      <li className={styles['coz-nav-item']}>
        <Link to='/shared' className={styles['pho-cat-shared']} activeClassName={styles['active']}>
          { t('Nav.shared') }
        </Link>
      </li>
      <li className={styles['coz-nav-item']}>
        <Link to='/trash' className={styles['pho-cat-trash']} activeClassName={styles['active']}>
          { t('Nav.trash') }
        </Link>
      </li>
    </ul>
  </nav>
)

export default translate()(Nav)
