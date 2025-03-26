import React from 'react'

import flag from 'cozy-flags'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import Divider from 'cozy-ui/transpiled/react/Divider'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import AddEncryptedFolderItem from '@/modules/drive/Toolbar/components/AddEncryptedFolderItem'
import AddFolderItem from '@/modules/drive/Toolbar/components/AddFolderItem'
import CreateNoteItem from '@/modules/drive/Toolbar/components/CreateNoteItem'
import CreateOnlyOfficeItem from '@/modules/drive/Toolbar/components/CreateOnlyOfficeItem'
import CreateShortcut from '@/modules/drive/Toolbar/components/CreateShortcut'
import { ScannerMenuItem } from '@/modules/drive/Toolbar/components/Scanner/ScannerMenuItem'
import { useScannerContext } from '@/modules/drive/Toolbar/components/Scanner/ScannerProvider'
import UploadItem from '@/modules/drive/Toolbar/components/UploadItem'
import { isOfficeEditingEnabled } from '@/modules/views/OnlyOffice/helpers'

export const ActionMenuContent = ({
  isDisabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent,
  isPublic,
  isEncryptedFolder,
  displayedFolder,
  onClick
}) => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const { hasScanner } = useScannerContext()

  return (
    <>
      <ActionsMenuMobileHeader>
        <ListItemText
          primary={t('toolbar.menu_create')}
          primaryTypographyProps={{ variant: 'h6' }}
        />
      </ActionsMenuMobileHeader>

      {canCreateFolder && !isEncryptedFolder && (
        <AddFolderItem onClick={onClick} />
      )}
      {canCreateFolder && !isPublic && flag('drive.enable-encryption') && (
        <AddEncryptedFolderItem onClick={onClick} />
      )}
      {!isPublic && !isEncryptedFolder && (
        <CreateNoteItem displayedFolder={displayedFolder} />
      )}
      {canUpload && isOfficeEditingEnabled(isDesktop) && !isEncryptedFolder && (
        <>
          <CreateOnlyOfficeItem fileClass="text" />
          <CreateOnlyOfficeItem fileClass="spreadsheet" />
          <CreateOnlyOfficeItem fileClass="slide" />
        </>
      )}
      {!isEncryptedFolder && (
        <CreateShortcut onCreated={refreshFolderContent} onClick={onClick} />
      )}
      {canUpload && <Divider className="u-mv-half" />}
      {canUpload && (
        <UploadItem
          disabled={isDisabled}
          onUploaded={refreshFolderContent}
          displayedFolder={displayedFolder}
          onClick={onClick}
        />
      )}
      {hasScanner && <ScannerMenuItem onClick={onClick} />}
    </>
  )
}

const AddMenu = ({
  anchorRef,
  handleClose,
  isDisabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent,
  isPublic,
  isEncryptedFolder,
  displayedFolder,
  ...actionMenuProps
}) => {
  return (
    <ActionsMenu
      open
      ref={anchorRef}
      onClose={handleClose}
      docs={[displayedFolder]}
      actions={[]}
      {...actionMenuProps}
    >
      <ActionMenuContent
        isDisabled={isDisabled}
        canCreateFolder={canCreateFolder}
        canUpload={canUpload}
        refreshFolderContent={refreshFolderContent}
        isPublic={isPublic}
        isEncryptedFolder={isEncryptedFolder}
        displayedFolder={displayedFolder}
        onClick={handleClose}
      />
    </ActionsMenu>
  )
}

export default AddMenu
