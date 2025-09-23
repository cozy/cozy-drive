import React, { useState, useCallback, useRef } from 'react'

import { useSharingContext } from 'cozy-sharing'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import Divider from 'cozy-ui/transpiled/react/Divider'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { MoreButton } from '@/components/Button'
import AddMenuProvider from '@/modules/drive/AddMenu/AddMenuProvider'
import AddMenuItem from '@/modules/drive/Toolbar/components/AddMenuItem'
import DownloadButtonItem from '@/modules/drive/Toolbar/components/DownloadButtonItem'
import InsideRegularFolder from '@/modules/drive/Toolbar/components/InsideRegularFolder'
import LeaveSharedDriveButtonItem from '@/modules/drive/Toolbar/components/LeaveSharedDriveButtonItem'
import ManageAccessItem from '@/modules/drive/Toolbar/components/ManageAccessItem'
import DeleteItem from '@/modules/drive/Toolbar/delete/DeleteItem'
import SelectableItem from '@/modules/drive/Toolbar/selectable/SelectableItem'
import ShareItem from '@/modules/drive/Toolbar/share/ShareItem'

export const openMenu = setMenuVisible => {
  setMenuVisible(true)
}

export const closeMenu = setMenuVisible => {
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
  displayedFolder,
  folderId,
  showSelectionBar,
  isSelectionBarVisible,
  isSharedWithMe,
  isSharedDriveRecipient,
  isSharedDriveOwner
}) => {
  const [menuIsVisible, setMenuVisible] = useState(false)
  const anchorRef = useRef()
  const { isMobile } = useBreakpoints()
  const { allLoaded } = useSharingContext() // We need to wait for the sharing context to be completely loaded to avoid race conditions

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
        displayedFolder={displayedFolder}
        isSelectionBarVisible={isSelectionBarVisible}
      >
        {menuIsVisible && (
          <ActionsMenu
            open
            ref={anchorRef}
            onClose={handleClose}
            docs={[displayedFolder]}
            actions={[]}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            {isMobile && allLoaded && (
              <InsideRegularFolder
                displayedFolder={displayedFolder}
                folderId={folderId}
              >
                <ShareItem displayedFolder={displayedFolder} />
              </InsideRegularFolder>
            )}
            <InsideRegularFolder
              displayedFolder={displayedFolder}
              folderId={folderId}
            >
              {!isSharedDriveRecipient && (
                <DownloadButtonItem files={[displayedFolder]} />
              )}
            </InsideRegularFolder>
            {isMobile && hasWriteAccess && <AddMenuItem />}
            <SelectableItem onClick={showSelectionBar} />
            {isSharedDriveOwner && <ManageAccessItem />}
            {hasWriteAccess && (
              <InsideRegularFolder
                displayedFolder={displayedFolder}
                folderId={folderId}
              >
                <Divider className="u-mv-half" />
                <DeleteItem
                  displayedFolder={displayedFolder}
                  isSharedDriveOwner={isSharedDriveOwner}
                  isSharedWithMe={isSharedWithMe}
                />
              </InsideRegularFolder>
            )}
            {isSharedDriveRecipient && isSharedWithMe && (
              <LeaveSharedDriveButtonItem files={[displayedFolder]} />
            )}
          </ActionsMenu>
        )}
      </AddMenuProvider>
    </div>
  )
}

export default React.memo(MoreMenu)
