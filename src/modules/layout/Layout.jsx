import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import CozyDevtools from 'cozy-client/dist/devtools'
import flag from 'cozy-flags'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout as LayoutUI } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'

import ButtonClient from 'components/pushClient/Button'
import SupportUs from 'components/pushClient/SupportUs'
import { initFlags } from 'lib/flags'
import Nav from 'modules/navigation/Nav'
import { SelectionProvider } from 'modules/selection/SelectionProvider'
import { UploadQueue } from 'modules/upload'

initFlags()

const Layout = () => {
  return (
    <LayoutUI>
      <BarComponent disableInternalStore />
      <FlagSwitcher />
      <Sidebar className="u-flex-justify-between">
        <Nav />
        <div>
          <SupportUs />
          <ButtonClient />
        </div>
      </Sidebar>
      <UploadQueue />
      <SelectionProvider>
        <Outlet />
      </SelectionProvider>
      <Sprite />
      {flag('debug') && <CozyDevtools />}
    </LayoutUI>
  )
}

export default Layout
