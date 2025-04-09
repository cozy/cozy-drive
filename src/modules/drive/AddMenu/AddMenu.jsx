import React from 'react'

import flag from 'cozy-flags'
import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'
import ActionsMenuMobileHeader from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuMobileHeader'
import Divider from 'cozy-ui/transpiled/react/Divider'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

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
  onClick,
  isReadOnly
}) => {
  const { t } = useI18n()
  const { isDesktop } = useBreakpoints()
  const { hasScanner } = useScannerContext()
  const { showAlert } = useAlert()

  const handleReadOnlyClick = e => {
    e.stopPropagation()
    e.preventDefault()
    showAlert(
      t(
        'AddMenu.readOnlyFolder',
        'This is a read-only folder. You cannot perform this action.'
      ),
      'warning'
    )
    onClick()
  }

  const createActionOnClick = isReadOnly ? handleReadOnlyClick : onClick

  return (
    <>
      <ActionsMenuMobileHeader>
        <ListItemText
          primary={t('toolbar.menu_create')}
          primaryTypographyProps={{ variant: 'h6' }}
        />
      </ActionsMenuMobileHeader>

      {canCreateFolder && !isEncryptedFolder && (
        <AddFolderItem onClick={onClick} isReadOnly={isReadOnly} />
      )}
      {canCreateFolder && !isPublic && flag('drive.enable-encryption') && (
        <AddEncryptedFolderItem onClick={onClick} isReadOnly={isReadOnly} />
      )}
      {!isPublic && !isEncryptedFolder && (
        <CreateNoteItem
          displayedFolder={displayedFolder}
          isReadOnly={isReadOnly}
          onClick={onClick}
        />
      )}
      {canUpload && isOfficeEditingEnabled(isDesktop) && !isEncryptedFolder && (
        <>
          <CreateOnlyOfficeItem
            fileClass="text"
            isReadOnly={isReadOnly}
            onClick={onClick}
          />
          <CreateOnlyOfficeItem
            fileClass="spreadsheet"
            isReadOnly={isReadOnly}
            onClick={onClick}
          />
          <CreateOnlyOfficeItem
            fileClass="slide"
            isReadOnly={isReadOnly}
            onClick={onClick}
          />
        </>
      )}
      {!isEncryptedFolder && (
        <CreateShortcut
          onCreated={refreshFolderContent}
          onClick={onClick}
          isReadOnly={isReadOnly}
        />
      )}
      {canUpload && <Divider className="u-mv-half" />}
      {canUpload && (
        <UploadItem
          disabled={isDisabled}
          onUploaded={refreshFolderContent}
          displayedFolder={displayedFolder}
          onClick={onClick}
          isReadOnly={isReadOnly}
        />
      )}
      {hasScanner && <ScannerMenuItem onClick={createActionOnClick} />}
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
  isReadOnly,
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
        isReadOnly={isReadOnly}
      />
    </ActionsMenu>
  )
}

export default AddMenu
