/* global __TARGET__ */
import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'

import Sidebar from 'cozy-ui/react/Sidebar'
import Nav from '../containers/Nav'
import ButtonClient from '../../components/pushClient/Button'
import { UploadQueue } from '../ducks/upload'
import Alerter from 'cozy-ui/react/Alerter'
import UserActionRequired from '../mobile/containers/UserActionRequired'

const Layout = ({ t, children }) => (
  <div className={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Sidebar className={styles['fil-sidebar']}>
      <Nav />
      <ButtonClient />
    </Sidebar>
    <Alerter t={t} />
    <UploadQueue />
    {__TARGET__ === 'mobile' && <UserActionRequired />}
    {children}
  </div>
)

export default translate()(Layout)
