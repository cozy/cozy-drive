import React, { useState, useCallback, useRef } from 'react'

import { useClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'

import { MoreButton } from 'components/Button'
import SelectableItem from 'modules/drive/Toolbar/selectable/SelectableItem'
import { downloadFiles } from 'modules/actions/utils'
import AddMenuItem from 'modules/drive/Toolbar/components/AddMenuItem'

const PublicToolbarMoreMenu = ({
  files,
  hasWriteAccess,
  children,
  showSelectionBar
}) => {
  const anchorRef = useRef()
  const { t } = useI18n()
  const client = useClient()
  const { isMobile } = useBreakpoints()

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
          {children}
          {isMobile && files.length > 0 && (
            <ActionMenuItem
              onClick={() => downloadFiles(client, files)}
              left={<Icon icon={'download'} />}
            >
              {t('toolbar.menu_download')}
            </ActionMenuItem>
          )}
          {isMobile && hasWriteAccess && <AddMenuItem />}
          {files.length > 1 && (
            <SelectableItem showSelectionBar={showSelectionBar} />
          )}
        </ActionMenu>
      )}
    </>
  )
}

export default PublicToolbarMoreMenu
