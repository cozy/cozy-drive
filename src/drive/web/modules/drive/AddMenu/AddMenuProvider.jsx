import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  createContext
} from 'react'
import { useSelector } from 'react-redux'

import useBrowserOffline from 'cozy-ui/transpiled/react/hooks/useBrowserOffline'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import {
  closeMenu,
  toggleMenu
} from 'drive/web/modules/drive/Toolbar/components/MoreMenu'
import AddMenu from 'drive/web/modules/drive/AddMenu/AddMenu'
import ScanWrapper from 'drive/web/modules/drive/Toolbar/components/ScanWrapper'

export const AddMenuContext = createContext()

const AddMenuProvider = ({
  disabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent,
  children
}) => {
  const [menuIsVisible, setMenuVisible] = useState(false)
  const selectionModeActive = useSelector(isSelectionBarVisible)
  const isOffline = useBrowserOffline()
  const anchorRef = useRef()

  const handleClose = useCallback(() => closeMenu(setMenuVisible), [
    setMenuVisible
  ])

  const handleToggle = useCallback(
    () => toggleMenu(menuIsVisible, setMenuVisible),
    [menuIsVisible, setMenuVisible]
  )

  const isDisabled = useMemo(() => disabled || selectionModeActive, [
    disabled,
    selectionModeActive
  ])

  const handleOfflineClick = useCallback(e => {
    e.stopPropagation()
    Alerter.error('alert.offline')
  }, [])

  return (
    <AddMenuContext.Provider
      value={{
        anchorRef,
        handleToggle,
        isDisabled,
        isOffline,
        handleOfflineClick
      }}
    >
      {children}
      <ScanWrapper>
        {menuIsVisible && (
          <AddMenu
            anchorRef={anchorRef}
            handleClose={handleClose}
            canCreateFolder={canCreateFolder}
            canUpload={canUpload}
            refreshFolderContent={refreshFolderContent}
          />
        )}
      </ScanWrapper>
    </AddMenuContext.Provider>
  )
}

export default React.memo(AddMenuProvider)
