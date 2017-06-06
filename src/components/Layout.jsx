import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import Sidebar from './Sidebar'
import Alerter from './Alerter'
import ButtonClientMobile from './ButtonClientMobile'

import { UploadQueue } from '../ducks/upload'

export const Layout = ({ t, children }) => (
  <div className={classNames(styles['pho-wrapper'], styles['coz-sticky'])}>
    <Sidebar />

    <main className={styles['pho-content']}>
      <ButtonClientMobile />
      { children }
    </main>
    <Alerter t={t} />
    <UploadQueue />
  </div>
)

export default translate()(Layout)
