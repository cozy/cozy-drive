import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'

import { BarComponent } from 'cozy-bar'
import CozyDevtools from 'cozy-devtools'
import flag from 'cozy-flags'
import FlagSwitcher from 'cozy-flags/dist/FlagSwitcher'
import { useSharingContext } from 'cozy-sharing'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import { Layout as LayoutUI } from 'cozy-ui/transpiled/react/Layout'
import Sidebar from 'cozy-ui/transpiled/react/Sidebar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import StorageButton from '@/components/Storage/StorageButton'
import StorageProgress from '@/components/Storage/StorageProgress'
import ButtonClient from '@/components/pushClient/Button'
import SupportUs from '@/components/pushClient/SupportUs'
import { ROOT_DIR_ID } from '@/constants/config'
import { useDisplayedFolder } from '@/hooks'
import { initFlags } from '@/lib/flags'
import AddMenuProvider from '@/modules/drive/AddMenu/AddMenuProvider'
import AddButton from '@/modules/drive/Toolbar/components/AddButton'
import Nav from '@/modules/navigation/Nav'
import { NavProvider, useNavContext } from '@/modules/navigation/NavContext'
import {
  wasOperationRedirected,
  RESET_OPERATION_REDIRECTED
} from '@/modules/navigation/duck/reducer'
import { SelectionProvider } from '@/modules/selection/SelectionProvider'
import UploadQueue from '@/modules/upload/UploadQueue'

initFlags()

const LayoutContent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isMobile } = useBreakpoints()
  const { displayedFolder } = useDisplayedFolder()
  const { isDesktop } = useBreakpoints()
  const { hasWriteAccess } = useSharingContext()

  const shouldRedirect = useSelector(wasOperationRedirected)
  const [, setLastClicked] = useNavContext()

  useEffect(() => {
    if (shouldRedirect) {
      // Update lastClicked state to ensure sidebar shows the correct active item
      setLastClicked(`/folder/${ROOT_DIR_ID}`)
      navigate(`/folder/${ROOT_DIR_ID}`)
      dispatch({ type: RESET_OPERATION_REDIRECTED })
    }
  }, [shouldRedirect, navigate, dispatch, setLastClicked])

  const isFolderReadOnly = displayedFolder
    ? !hasWriteAccess(displayedFolder._id)
    : false

  return (
    <LayoutUI>
      <BarComponent
        searchOptions={{ enabled: !isMobile }}
        disableInternalStore
      />
      <FlagSwitcher />
      <Sidebar className="u-flex-justify-between">
        <div>
          {isDesktop ? (
            <AddMenuProvider
              canCreateFolder={true}
              canUpload={true}
              disabled={false}
              displayedFolder={displayedFolder}
              isSelectionBarVisible={false}
              isReadOnly={isFolderReadOnly}
            >
              <div className="u-mh-1-half u-mt-1-half">
                <AddButton className="u-w-100 u-bdrs-6" />
              </div>
            </AddMenuProvider>
          ) : null}
          <Nav />
        </div>
        <div>
          {isDesktop && (
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

const Layout = () => {
  return (
    <NavProvider>
      <LayoutContent />
    </NavProvider>
  )
}

export default Layout
