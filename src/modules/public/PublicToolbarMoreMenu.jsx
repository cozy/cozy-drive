import React, { useState, useCallback, useRef } from 'react'

import { useClient } from 'cozy-client'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ActionMenu, {
  ActionMenuItem
} from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { MoreButton } from 'components/Button'
import { downloadFiles } from 'modules/actions/utils'
import AddMenuItem from 'modules/drive/Toolbar/components/AddMenuItem'
import SelectableItem from 'modules/drive/Toolbar/selectable/SelectableItem'

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
  const { showAlert } = useAlert()

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
              onClick={() => downloadFiles(client, files, { showAlert, t })}
              left={<Icon icon="download" />}
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
