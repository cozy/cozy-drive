import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { ModalManager } from 'react-cozy-helpers'
import { translate } from 'cozy-ui/react/I18n'

import Sidebar from 'cozy-ui/react/Sidebar'
import Nav from '../containers/Nav'
import ButtonClient from '../../components/pushClient/Button'
import { UploadQueue } from '../ducks/upload'
import Alerter from 'cozy-ui/react/Alerter'

const Layout = ({ t, children }) => (
  <div className={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    <Sidebar className={styles['fil-sidebar']}>
      <Nav />
      <ButtonClient />
    </Sidebar>
    <Alerter t={t} />
    <UploadQueue />
    {children}
    <ModalManager />
  </div>
)

export default translate()(Layout)
