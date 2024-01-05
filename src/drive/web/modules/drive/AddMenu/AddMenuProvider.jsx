import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  createContext
} from 'react'

import { logException } from 'lib/reporter'
import useBrowserOffline from 'cozy-ui/transpiled/react/hooks/useBrowserOffline'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import {
  closeMenu,
  toggleMenu
} from 'drive/web/modules/drive/Toolbar/components/MoreMenu'
import AddMenu from 'drive/web/modules/drive/AddMenu/AddMenu'
import { ScannerProvider } from 'drive/web/modules/drive/Toolbar/components/Scanner/ScannerProvider'
import { isEncryptedFolder } from 'lib/encryption'

export const AddMenuContext = createContext()

const AddMenuProvider = ({
  disabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent,
  children,
  isPublic,
  navigate,
  params,
  displayedFolder,
  isSelectionBarVisible
}) => {
  const [menuIsVisible, setMenuVisible] = useState(false)
  const isOffline = useBrowserOffline()
  const anchorRef = useRef()

  const handleClose = useCallback(
    () => closeMenu(setMenuVisible),
    [setMenuVisible]
  )

  const handleToggle = useCallback(
    () => toggleMenu(menuIsVisible, setMenuVisible),
    [menuIsVisible, setMenuVisible]
  )

  const isDisabled = useMemo(
    () => disabled || isSelectionBarVisible,
    [disabled, isSelectionBarVisible]
  )

  const isEncryptedDir = useMemo(
    () => isEncryptedFolder(displayedFolder),
    [displayedFolder]
  )

  const handleOfflineClick = useCallback(e => {
    e.stopPropagation()
    Alerter.error('alert.offline')
    logException(
      `Offline click on AddMenu button detected. Here is the value of window.navigator.onLine: ${window.navigator.onLine}`
    )
  }, [])

  return (
    <AddMenuContext.Provider
      value={{
        anchorRef,
        handleToggle,
        isDisabled,
        isOffline,
        handleOfflineClick,
        isPublic,
        a11y: {
          'aria-controls': menuIsVisible ? 'add-menu' : undefined,
          'aria-haspopup': true,
          'aria-expanded': menuIsVisible ? true : undefined
        }
      }}
    >
      {children}
      <ScannerProvider displayedFolder={displayedFolder}>
        {menuIsVisible && (
          <AddMenu
            id="add-menu"
            anchorRef={anchorRef}
            handleClose={handleClose}
            canCreateFolder={canCreateFolder}
            canUpload={canUpload}
            refreshFolderContent={refreshFolderContent}
            isPublic={isPublic}
            isEncryptedFolder={isEncryptedDir}
            navigate={navigate}
            params={params}
            displayedFolder={displayedFolder}
          />
        )}
      </ScannerProvider>
    </AddMenuContext.Provider>
  )
}

export default React.memo(AddMenuProvider)
