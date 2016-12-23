import styles from '../styles/nav'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'
import classNames from 'classnames'

const Nav = ({ t }) => (
  <nav>
    <ul class={styles['fil-nav']}>
      <li class={styles['fil-nav-item']}>
        <a href='#files' class={classNames(styles['fil-cat-files'], styles['active'])}>{ t('nav.item_files') }</a>
      </li>
      <li class={styles['fil-nav-item']}>
        <a href='#recent' class={styles['fil-cat-recent']}>{ t('nav.item_recent') }</a>
      </li>
      <li class={styles['fil-nav-item']}>
        <a href='#shared' class={styles['fil-cat-shared']}>{ t('nav.item_share') }</a>
      </li>
      <li class={styles['fil-nav-item']}>
        <a href='#activity' class={styles['fil-cat-activity']}>{ t('nav.item_activity') }</a>
      </li>
      <li class={styles['fil-nav-item']}>
        <a href='#trash' class={styles['fil-cat-trash']}>{ t('nav.item_trash') }</a>
      </li>
    </ul>
  </nav>
)

export default translate()(Nav)
