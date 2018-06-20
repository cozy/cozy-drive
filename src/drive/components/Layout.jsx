/* global __TARGET__ */
import styles from '../styles/layout'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

import { Layout as LayoutUI } from 'cozy-ui/react/Layout'
import Sidebar from 'cozy-ui/react/Sidebar'
import Nav from '../containers/Nav'
import ButtonClient from '../../components/pushClient/Button'
import { UploadQueue } from '../ducks/upload'
import Alerter from 'cozy-ui/react/Alerter'
import UserActionRequired from '../mobile/containers/UserActionRequired'

const Layout = ({ t, children }) => (
  <LayoutUI>
    <Sidebar className={styles['fil-sidebar']}>
      <Nav />
      <ButtonClient />
    </Sidebar>
    <Alerter t={t} />
    <UploadQueue />
    {__TARGET__ === 'mobile' && <UserActionRequired />}
    {children}
  </LayoutUI>
)

export default translate()(Layout)
