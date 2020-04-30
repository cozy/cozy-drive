import React, { useState, useCallback } from 'react'

import { MoreButton } from 'components/Button'
import { isMobileApp } from 'cozy-device-helper'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import ActionMenu from 'cozy-ui/transpiled/react/ActionMenu'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import NotRootFolder from 'drive/web/modules/drive/Toolbar/components/NotRootFolder'

import UploadItem from './UploadItem'
import DeleteItem from '../delete/DeleteItem'
import SelectableItem from '../selectable/SelectableItem'
import AddFolderItem from './AddFolderItem'
import CreateNoteItem from './CreateNoteItem'
import CreateShortcut from './CreateShortcut'
import DownloadButtonItem from './DownloadButtonItem'
import ShareItem from '../share/ShareItem'
import ScanWrapper from './ScanWrapper'

const MoreMenu = ({
  isDisabled,
  canCreateFolder,
  canUpload,
  hasWriteAccess,
  breakpoints: { isMobile }
}) => {
  const [menuIsVisible, setMenuVisible] = useState(false)
  const anchorRef = React.createRef()

  const openMenu = useCallback(() => setMenuVisible(true))
  const closeMenu = useCallback(() => setMenuVisible(false))

  return (
    <div>
      <div ref={anchorRef}>
        <MoreButton onClick={openMenu} />
      </div>
      {menuIsVisible && (
        <ActionMenu
          placement="bottom-end"
          anchorElRef={anchorRef}
          onClose={closeMenu}
          autoclose
        >
          {canCreateFolder && hasWriteAccess && <AddFolderItem />}
          {hasWriteAccess && <CreateNoteItem />}
          {hasWriteAccess && <CreateShortcut />}
          {canUpload && hasWriteAccess && <UploadItem disabled={isDisabled} />}
          {isMobileApp() &&
            canUpload &&
            hasWriteAccess && (
              <ScanWrapper insideMoreMenu disabled={isDisabled} />
            )}
          {hasWriteAccess && <hr />}
          {isMobile && (
            <NotRootFolder>
              <ShareItem />
            </NotRootFolder>
          )}
          <NotRootFolder>
            <DownloadButtonItem />
          </NotRootFolder>
          <SelectableItem />
          {hasWriteAccess && (
            <NotRootFolder>
              <hr />
              <DeleteItem />
            </NotRootFolder>
          )}
        </ActionMenu>
      )}
    </div>
  )
}

export default withBreakpoints()(translate()(MoreMenu))
