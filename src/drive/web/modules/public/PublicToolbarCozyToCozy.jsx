import React, { useState, useCallback } from 'react'

import { useClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'

import { BarRightWithProvider } from 'components/Bar'
import { MoreButton } from 'components/Button'
import SelectableItem from 'drive/web/modules/drive/Toolbar/selectable/SelectableItem'
import { downloadFiles } from 'drive/web/modules/actions/utils'
import { DownloadFilesButton } from './DownloadButton'
import { isFilesIsFile } from './PublicToolbarByLink'

const openExternalLink = url => (window.location = url)

const MoreMenu = ({
  isSharingShortcutCreated,
  discoveryLink,
  files,
  isMobile
}) => {
  const { t } = useI18n()
  const client = useClient()
  const anchorRef = React.createRef()

  const [menuIsVisible, setMenuVisible] = useState(false)
  const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])
  const toggleMenu = useCallback(() => {
    if (menuIsVisible) return closeMenu()
    openMenu()
  }, [closeMenu, openMenu, menuIsVisible])
  return (
    <>
      <div ref={anchorRef}>
        <MoreButton onClick={toggleMenu} />
      </div>

      {menuIsVisible && (
        <ActionMenu onClose={closeMenu} autoclose anchorElRef={anchorRef}>
          <ActionMenuItem
            onClick={() => openExternalLink(discoveryLink)}
            left={
              <Icon icon={isSharingShortcutCreated ? 'sync' : 'to-the-cloud'} />
            }
          >
            {isSharingShortcutCreated
              ? t('toolbar.menu_sync_cozy')
              : t('toolbar.add_to_mine')}
          </ActionMenuItem>

          {isMobile && files.length > 0 && (
            <ActionMenuItem
              onClick={() => downloadFiles(client, files)}
              left={<Icon icon={'download'} />}
            >
              {t('toolbar.menu_download')}
            </ActionMenuItem>
          )}
          {files.length > 1 && <SelectableItem />}
        </ActionMenu>
      )}
    </>
  )
}

const PublicToolbarCozyToCozy = ({
  discoveryLink,
  files,
  isSharingShortcutCreated
}) => {
  const isFile = isFilesIsFile(files)
  const { isMobile } = useBreakpoints()

  const shouldDisplayMoreMenu = isMobile || (!isFile && files.length > 0)

  return (
    <BarRightWithProvider>
      {!isMobile && files.length > 0 && <DownloadFilesButton files={files} />}
      {shouldDisplayMoreMenu && (
        <MoreMenu
          files={files}
          discoveryLink={discoveryLink}
          isSharingShortcutCreated={isSharingShortcutCreated}
          isMobile={isMobile}
        />
      )}
    </BarRightWithProvider>
  )
}

export default PublicToolbarCozyToCozy
