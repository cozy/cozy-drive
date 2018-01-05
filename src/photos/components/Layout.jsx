/* global __TARGET__ */

import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import Sidebar from 'cozy-ui/react/Sidebar'
import Nav from '../components/Nav'
import ButtonClient from '../../components/pushClient/Button'
import BannerClient from '../../components/pushClient/Banner'
import Alerter from './Alerter'

import { UploadQueue } from '../ducks/upload'

export const Layout = ({ t, children }) => (
  <div className={classNames(styles['pho-wrapper'], styles['coz-sticky'])}>
    <Sidebar className={styles['pho-sidebar']}>
      <Nav />
      <ButtonClient />
    </Sidebar>

    <Alerter t={t} />
    <UploadQueue />
    <main className={styles['pho-content']}>
      {__TARGET__ !== 'mobile' && <BannerClient />}
      {children}
    </main>
  </div>
)

export default translate()(Layout)
