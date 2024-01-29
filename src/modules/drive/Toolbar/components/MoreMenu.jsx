import React, { useState, useCallback } from 'react'

import { isIOSApp } from 'cozy-device-helper'
import ActionMenu from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { MoreButton } from 'components/Button'
import AddMenuProvider from 'modules/drive/AddMenu/AddMenuProvider'
import AddMenuItem from 'modules/drive/Toolbar/components/AddMenuItem'
import DownloadButtonItem from 'modules/drive/Toolbar/components/DownloadButtonItem'
import InsideRegularFolder from 'modules/drive/Toolbar/components/InsideRegularFolder'
import DeleteItem from 'modules/drive/Toolbar/delete/DeleteItem'
import SelectableItem from 'modules/drive/Toolbar/selectable/SelectableItem'
import ShareItem from 'modules/drive/Toolbar/share/ShareItem'

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

const MoreMenu = ({
  isDisabled,
  hasWriteAccess,
  canUpload,
  canCreateFolder,
  navigate,
  params,
  displayedFolder,
  folderId,
  showSelectionBar,
  isSelectionBarVisible,
  pathname
}) => {
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
      <AddMenuProvider
        canCreateFolder={canCreateFolder}
        canUpload={canUpload}
        disabled={isDisabled}
        navigate={navigate}
        params={params}
        displayedFolder={displayedFolder}
        isSelectionBarVisible={isSelectionBarVisible}
      >
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
              <InsideRegularFolder
                displayedFolder={displayedFolder}
                folderId={folderId}
              >
                <ShareItem
                  displayedFolder={displayedFolder}
                  navigate={navigate}
                  pathname={pathname}
                />
              </InsideRegularFolder>
            )}
            <InsideRegularFolder
              displayedFolder={displayedFolder}
              folderId={folderId}
            >
              <DownloadButtonItem displayedFolder={displayedFolder} />
            </InsideRegularFolder>
            {isMobile && hasWriteAccess && <AddMenuItem />}
            <SelectableItem showSelectionBar={showSelectionBar} />
            {hasWriteAccess && (
              <InsideRegularFolder
                displayedFolder={displayedFolder}
                folderId={folderId}
              >
                <hr />
                {/* TODO DeleteItem needs props */}
                <DeleteItem displayedFolder={displayedFolder} />
              </InsideRegularFolder>
            )}
          </ActionMenu>
        )}
      </AddMenuProvider>
    </div>
  )
}

export default React.memo(MoreMenu)