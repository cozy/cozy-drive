import React, { useState, useCallback } from 'react'

import { isMobileApp, isIOSApp } from 'cozy-device-helper'
import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { MoreButton } from 'components/Button'
import InsideRegularFolder from 'drive/web/modules/drive/Toolbar/components/InsideRegularFolder'
import DeleteItem from 'drive/web/modules/drive/Toolbar/delete/DeleteItem'
import SelectableItem from 'drive/web/modules/drive/Toolbar/selectable/SelectableItem'
import ShareItem from 'drive/web/modules/drive/Toolbar/share/ShareItem'
import DownloadButtonItem from 'drive/web/modules/drive/Toolbar/components/DownloadButtonItem'

export const openMenu = setMenuVisible => {
  if (window.StatusBar && isIOSApp()) {
    window.StatusBar.backgroundColorByHexString('#989AA0')
  }
  setMenuVisible(true)
}

export const closeMenu = setMenuVisible => {
  if (window.StatusBar && isIOSApp()) {
    window.StatusBar.backgroundColorByHexString('#FFFFFF')
  }
  setMenuVisible(false)
}

export const toggleMenu = (menuIsVisible, setMenuVisible) => {
  if (menuIsVisible) return closeMenu(setMenuVisible)
  openMenu(setMenuVisible)
}

const MoreMenu = ({ isDisabled, hasWriteAccess }) => {
  const [menuIsVisible, setMenuVisible] = useState(false)
  const anchorRef = React.createRef()
  const { isMobile } = useBreakpoints()

  const handleToggle = useCallback(
    () => toggleMenu(menuIsVisible, setMenuVisible),
    [menuIsVisible, setMenuVisible]
  )
  const handleClose = useCallback(
    () => closeMenu(setMenuVisible),
    [setMenuVisible]
  )

  return (
    <div>
      <div ref={anchorRef}>
        <MoreButton onClick={handleToggle} disabled={isDisabled} />
      </div>
      {menuIsVisible && (
        <ActionMenu
          anchorElRef={anchorRef}
          onClose={handleClose}
          autoclose={true}
          popperOptions={{
            placement: 'bottom-end'
          }}
        >
          {isMobile && (
            <InsideRegularFolder>
              <ShareItem />
            </InsideRegularFolder>
          )}
          {!isMobileApp() && (
            <InsideRegularFolder>
              <DownloadButtonItem />
            </InsideRegularFolder>
          )}
          <SelectableItem />
          {hasWriteAccess && (
            <InsideRegularFolder>
              <hr />
              {/* TODO DeleteItem needs props */}
              <DeleteItem />
            </InsideRegularFolder>
          )}
        </ActionMenu>
      )}
    </div>
  )
}

export default React.memo(MoreMenu)
