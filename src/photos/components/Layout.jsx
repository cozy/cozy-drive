/* global __TARGET__ */

import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import Sidebar from './Sidebar'
import Alerter from './Alerter'
import BannerClient from '../../layout/pushClient/Banner'

import { UploadQueue } from '../ducks/upload'

export const Layout = ({ t, children }) => (
  <div className={classNames(styles['pho-wrapper'], styles['coz-sticky'])}>
    <Sidebar />

    <main className={styles['pho-content']}>
      { __TARGET__ !== 'mobile' && <BannerClient />}
      { children }
    </main>
    <Alerter t={t} />
    <UploadQueue />
  </div>
)

export default translate()(Layout)
