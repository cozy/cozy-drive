import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { ModalManager } from 'react-cozy-helpers'
import { translate } from 'cozy-ui/react/I18n'

import Sidebar from 'cozy-ui/react/Sidebar'
import Nav from '../containers/Nav'
import ButtonClient from '../../components/pushClient/Button'
import { UploadQueue } from '../ducks/upload'
// TODO: we use the cozy-ui Alerter here for the ShareByEmail component
// we need to make a choice relative to alerts...
import { Alerter as OldAlerter } from 'cozy-ui/react/Alerter'
import Alerter from 'photos/components/Alerter'

const Layout = ({ t, children }) => (
  <div className={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Sidebar className={styles['fil-sidebar']}>
      <Nav />
      <ButtonClient />
    </Sidebar>
    <OldAlerter />
    <Alerter t={t} />
    <UploadQueue />
    {children}
    <ModalManager />
  </div>
)

export default translate()(Layout)
