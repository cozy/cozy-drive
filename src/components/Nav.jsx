import styles from '../styles/nav'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Link } from 'react-router'

import classNames from 'classnames'

export const Nav = ({ t }) => (
  <nav>
    <ul className={styles['coz-nav']}>
      <li className={styles['coz-nav-item']}>
        <Link to='/photos' className={classNames(styles['pho-cat-photos'], styles['coz-nav-link'])} activeClassName={styles['active']}>
          { t('Nav.photos') }
        </Link>
      </li>
      <li className={styles['coz-nav-item']}>
        <Link to='/albums' className={classNames(styles['pho-cat-albums'], styles['coz-nav-link'])} activeClassName={styles['active']}>
          { t('Nav.albums') }
        </Link>
      </li>
    </ul>
  </nav>
)

export default translate()(Nav)
