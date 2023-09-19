/* global __TARGET__ */
import React from 'react'
import { Outlet } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { Layout as LayoutUI } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import CozyDevtools from 'cozy-client/dist/devtools'
import flag from 'cozy-flags'

import { initFlags } from 'lib/flags'
import Nav from 'drive/web/modules/navigation/Nav'
import ButtonClient from 'components/pushClient/Button'
import SupportUs from 'components/pushClient/SupportUs'
import { UploadQueue } from 'drive/web/modules/upload'
import UserActionRequired from 'drive/mobile/modules/authorization/UserActionRequired'
import { SelectionProvider } from 'drive/web/modules/selection/SelectionProvider'

initFlags()

const Layout = () => {
  const { t } = useI18n()
  return (
    <LayoutUI>
      <FlagSwitcher />
      <Sidebar className="u-flex-justify-between">
        <Nav />
        <div>
          <SupportUs />
          <ButtonClient />
        </div>
      </Sidebar>
      <Alerter t={t} />
      <UploadQueue />
      {__TARGET__ === 'mobile' && <UserActionRequired />}
      <SelectionProvider>
        <Outlet />
      </SelectionProvider>
      <Sprite />
      {flag('debug') && <CozyDevtools />}
    </LayoutUI>
  )
}

export default Layout
