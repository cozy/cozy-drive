import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import CozyDevtools from 'cozy-devtools'
import flag from 'cozy-flags'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout as LayoutUI } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import StorageButton from '@/components/Storage/StorageButton'
import StorageProgress from '@/components/Storage/StorageProgress'
import ButtonClient from '@/components/pushClient/Button'
import SupportUs from '@/components/pushClient/SupportUs'
import { initFlags } from '@/lib/flags'
import Nav from '@/modules/navigation/Nav'
import { SelectionProvider } from '@/modules/selection/SelectionProvider'
import UploadQueue from '@/modules/upload/UploadQueue'

initFlags()

const Layout = () => {
  const { isMobile } = useBreakpoints()

  return (
    <LayoutUI>
      <BarComponent
        searchOptions={{ enabled: !isMobile }}
        disableInternalStore
      />
      <FlagSwitcher />
      <Sidebar className="u-flex-justify-between">
        <Nav />
        <div>
          {isTwakeTheme() && (
            <div className="u-p-1-half">
              <StorageProgress />
              <StorageButton className="u-mt-1" />
            </div>
          )}
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
