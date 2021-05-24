import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  createContext
} from 'react'
import { useSelector } from 'react-redux'

import { isSelectionBarVisible } from 'drive/web/modules/selection/duck'
import {
  closeMenu,
  toggleMenu
} from 'drive/web/modules/drive/Toolbar/components/MoreMenu'
import AddMenu from 'drive/web/modules/drive/AddMenu/AddMenu'

export const AddMenuContext = createContext()

const AddMenuProvider = ({
  disabled,
  canCreateFolder,
  canUpload,
  children
}) => {
  const [menuIsVisible, setMenuVisible] = useState(false)
  const selectionModeActive = useSelector(isSelectionBarVisible)
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

  return (
    <AddMenuContext.Provider value={{ anchorRef, handleToggle, isDisabled }}>
      {children}
      {menuIsVisible && (
        <AddMenu
          anchorRef={anchorRef}
          handleClose={handleClose}
          canCreateFolder={canCreateFolder}
          canUpload={canUpload}
        />
      )}
    </AddMenuContext.Provider>
  )
}

export default React.memo(AddMenuProvider)
