import styles from '../styles/sidebar'

import { translate } from '../lib/I18n'

import React from 'react'
import classNames from 'classnames'

import Nav from '../containers/Nav'

const Sidebar = ({ t }) => (
  <aside class={styles['fil-sidebar']}>
    <Nav />
    <a href={t('nav.link-client')} className={classNames('coz-btn', 'coz-btn--secondary', styles['coz-btn--client'])}><span>{t('nav.btn-client')}</span></a>
  </aside>
)

export default translate()(Sidebar)
