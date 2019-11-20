/* global __TARGET__ */
import React from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { Layout as LayoutUI } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import flag, { FlagSwitcher } from 'cozy-flags'

import { initFlags } from 'lib/flags'
import Nav from 'drive/web/modules/navigation/Nav'
import ButtonClient from 'components/pushClient/Button'
import SupportUs from 'components/pushClient/SupportUs'

import { UploadQueue } from 'drive/web/modules/upload'
import UserActionRequired from 'drive/mobile/modules/authorization/UserActionRequired'
import { IconSprite } from 'cozy-ui/transpiled/react'

initFlags()

const Layout = ({ t, children }) => (
  <LayoutUI>
    {flag('switcher') && <FlagSwitcher />}
    <Sidebar className="u-flex-justify-between">
      <Nav />
      <div>
        <ButtonClient />
        <SupportUs />
      </div>
    </Sidebar>
    <Alerter t={t} />
    <UploadQueue />
    {__TARGET__ === 'mobile' && <UserActionRequired />}
    {children}
    <IconSprite />
  </LayoutUI>
)

export default translate()(Layout)
