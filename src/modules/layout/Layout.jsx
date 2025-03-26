import React from 'react'
import { Outlet } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import CozyDevtools from 'cozy-devtools'
import flag from 'cozy-flags'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import { SharedDocument } from 'cozy-sharing'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout as LayoutUI } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import StorageButton from '@/components/Storage/StorageButton'
import StorageProgress from '@/components/Storage/StorageProgress'
import ButtonClient from '@/components/pushClient/Button'
import SupportUs from '@/components/pushClient/SupportUs'
import { useDisplayedFolder, useCurrentFolderId } from '@/hooks'
import { initFlags } from '@/lib/flags'
import AddMenuProvider from '@/modules/drive/AddMenu/AddMenuProvider'
import AddButton from '@/modules/drive/Toolbar/components/AddButton'
import Nav from '@/modules/navigation/Nav'
import { SelectionProvider } from '@/modules/selection/SelectionProvider'
import UploadQueue from '@/modules/upload/UploadQueue'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

initFlags()

const Layout = () => {
  const { isMobile } = useBreakpoints()
  const folderId = useCurrentFolderId()
  const { displayedFolder } = useDisplayedFolder()
  const { isDesktop } = useBreakpoints()

  return (
    <LayoutUI>
      <BarComponent
        searchOptions={{ enabled: !isMobile }}
        disableInternalStore
      />
      <FlagSwitcher />
      <Sidebar className="u-flex-justify-between">
        <div>
          {folderId && isDesktop ? (
            <SharedDocument docId={folderId}>
              {sharingProps => {
                const { hasWriteAccess } = sharingProps
                return (
                  hasWriteAccess && (
                    <AddMenuProvider
                      canCreateFolder={true}
                      canUpload={true}
                      disabled={false}
                      displayedFolder={displayedFolder}
                      isSelectionBarVisible={false}
                    >
                      <AddButton className="u-mh-1-half u-mt-1-half u-miw-4 u-bdrs-6" />
                    </AddMenuProvider>
                  )
                )
              }}
            </SharedDocument>
          ) : null}
          <Nav />
        </div>
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
