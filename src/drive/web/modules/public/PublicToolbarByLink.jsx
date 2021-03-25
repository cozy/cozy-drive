import React, { useCallback, useState } from 'react'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import BarContextProvider from 'cozy-ui/transpiled/react/BarContextProvider'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { Button, Icon } from 'cozy-ui/transpiled/react'
import ActionMenu, { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'

import getHomeLinkHref from 'components/Button/getHomeLinkHref'
import SelectableItem from 'drive/web/modules/drive/Toolbar/selectable/SelectableItem'
import AddFolderItem from 'drive/web/modules/drive/Toolbar/components/AddFolderItem'
import UploadItem from 'drive/web/modules/drive/Toolbar/components/UploadItem'
import CreateShortcut from 'drive/web/modules/drive/Toolbar/components/CreateShortcut'
import UploadButtonItem from 'drive/web/modules/drive/Toolbar/components/UploadButtonItem'
import { downloadFiles } from 'drive/web/modules/actions/utils'
import CozyBarRightMobile from 'drive/web/modules/public/CozyBarRightMobile'

import { DownloadFilesButton } from './DownloadButton'

export const isFilesIsFile = files =>
  files.length === 1 && files[0].type === 'file'

const MoreButton = ({ disabled, onClick }) => {
  const { t } = useI18n()
  return (
    <Button
      data-test-id="more-button"
      theme="secondary"
      disabled={disabled}
      onClick={onClick}
      extension="narrow"
      icon={DotsIcon}
      iconOnly
      label={t('Toolbar.more')}
    />
  )
}
const MoreMenu = ({
  files,
  hasWriteAccess,
  refreshFolderContent,
  isMobile
}) => {
  const { t } = useI18n()
  const client = useClient()
  const anchorRef = React.createRef()

  const [menuIsVisible, setMenuVisible] = useState(false)

  const openMenu = useCallback(() => setMenuVisible(true), [setMenuVisible])
  const closeMenu = useCallback(() => setMenuVisible(false), [setMenuVisible])
  const toggleMenu = useCallback(
    () => {
      if (menuIsVisible) return closeMenu()
      openMenu()
    },
    [closeMenu, openMenu, menuIsVisible]
  )
  return (
    <>
      <div ref={anchorRef}>
        <MoreButton onClick={toggleMenu} />
      </div>
      {menuIsVisible && (
        <ActionMenu onClose={closeMenu} autoclose>
          {isMobile && (
            <ActionMenuItem
              onClick={() => getHomeLinkHref('sharing-drive')}
              left={<Icon icon={'to-the-cloud'} />}
            >
              {t('Share.create-cozy')}
            </ActionMenuItem>
          )}
          {isMobile && (
            <ActionMenuItem
              onClick={() => downloadFiles(client, files)}
              left={<Icon icon={'download'} />}
            >
              {t('toolbar.menu_download')}
            </ActionMenuItem>
          )}
          {hasWriteAccess && <AddFolderItem />}
          {hasWriteAccess && (
            <CreateShortcut onCreated={refreshFolderContent} />
          )}
          {hasWriteAccess && <UploadItem onUploaded={refreshFolderContent} />}
          {files.length > 1 && <SelectableItem />}
        </ActionMenu>
      )}
    </>
  )
}

const PublicToolbarByLink = ({
  files,
  hasWriteAccess,
  refreshFolderContent
}) => {
  const { t } = useI18n()
  const isFile = isFilesIsFile(files)
  const client = useClient()
  const { isMobile } = useBreakpoints()

  const shouldDisplayMoreMenu =
    isMobile || (!isFile && files.length > 0) || hasWriteAccess

  return (
    <CozyBarRightMobile>
      <BarContextProvider client={client} t={t} store={client.store}>
        {!isMobile && (
          <>
            {hasWriteAccess && (
              <UploadButtonItem onUploaded={refreshFolderContent} />
            )}
            <DownloadFilesButton files={files} />
          </>
        )}
        {shouldDisplayMoreMenu && (
          <MoreMenu
            hasWriteAccess={hasWriteAccess}
            refreshFolderContent={refreshFolderContent}
            isMobile={isMobile}
            files={files}
          />
        )}
      </BarContextProvider>
    </CozyBarRightMobile>
  )
}

export default PublicToolbarByLink
