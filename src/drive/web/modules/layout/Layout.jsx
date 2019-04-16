/* global __TARGET__ */
import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Layout as LayoutUI } from 'cozy-ui/react/Layout'
import Sidebar from 'cozy-ui/react/Sidebar'
import Alerter from 'cozy-ui/react/Alerter'

import Nav from 'drive/web/modules/navigation/Nav'
import ButtonClient from 'components/pushClient/Button'
import { UploadQueue } from 'drive/web/modules/upload'
import UserActionRequired from 'drive/mobile/modules/authorization/UserActionRequired'
import { IconSprite } from 'cozy-ui/transpiled/react'

import styles from 'drive/styles/layout.styl'

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
    <IconSprite />
  </LayoutUI>
)

export default translate()(Layout)
