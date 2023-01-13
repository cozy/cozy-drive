import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  createContext
} from 'react'
import { useSelector } from 'react-redux'
import { logException } from 'drive/lib/reporter'
import { useDisplayedFolder } from 'drive/hooks'
import useBrowserOffline from 'cozy-ui/transpiled/react/hooks/useBrowserOffline'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import {
  closeMenu,
  toggleMenu
} from 'drive/web/modules/drive/Toolbar/components/MoreMenu'
import AddMenu from 'drive/web/modules/drive/AddMenu/AddMenu'
import ScanWrapper from 'drive/web/modules/drive/Toolbar/components/ScanWrapper'
import { isEncryptedFolder } from 'drive/lib/encryption'

export const AddMenuContext = createContext()

const AddMenuProvider = ({
  disabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent,
  children,
  isPublic
}) => {
  const displayedFolder = useDisplayedFolder()
  const [menuIsVisible, setMenuVisible] = useState(false)
  const selectionModeActive = useSelector(isSelectionBarVisible)
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
    () => disabled || selectionModeActive,
    [disabled, selectionModeActive]
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
      <ScanWrapper>
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
          />
        )}
      </ScanWrapper>
    </AddMenuContext.Provider>
  )
}

export default React.memo(AddMenuProvider)
