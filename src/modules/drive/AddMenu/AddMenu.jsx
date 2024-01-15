import React from 'react'

import flag from 'cozy-flags'
import Typography from 'cozy-ui/transpiled/react/Typography'
import ActionMenu from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import AddEncryptedFolderItem from 'modules/drive/Toolbar/components/AddEncryptedFolderItem'
import AddFolderItem from 'modules/drive/Toolbar/components/AddFolderItem'
import CreateNoteItem from 'modules/drive/Toolbar/components/CreateNoteItem'
import CreateOnlyOfficeItem from 'modules/drive/Toolbar/components/CreateOnlyOfficeItem'
import CreateShortcut from 'modules/drive/Toolbar/components/CreateShortcut'
import { ScannerMenuItem } from 'modules/drive/Toolbar/components/Scanner/ScannerMenuItem'
import { useScannerContext } from 'modules/drive/Toolbar/components/Scanner/ScannerProvider'
import UploadItem from 'modules/drive/Toolbar/components/UploadItem'
import { isOfficeEditingEnabled } from 'modules/views/OnlyOffice/helpers'

export const ActionMenuContent = ({
  isDisabled,
  canCreateFolder,
  canUpload,
  refreshFolderContent,
  isPublic,
  isEncryptedFolder,
  navigate,
  params,
  displayedFolder
}) => {
  const { t } = useI18n()
  const { isMobile, isDesktop } = useBreakpoints()
  const { hasScanner } = useScannerContext()

  return (
    <>
      {isMobile && (
        <>
          <Typography variant="h6" className="u-p-1">
            {t('toolbar.menu_add')}
          </Typography>
          <hr />
        </>
      )}
      {canCreateFolder && !isEncryptedFolder && <AddFolderItem />}
      {canCreateFolder && !isPublic && flag('drive.enable-encryption') && (
        <AddEncryptedFolderItem />
      )}
      {!isPublic && !isEncryptedFolder && (
        <CreateNoteItem displayedFolder={displayedFolder} />
      )}
      {canUpload && isOfficeEditingEnabled(isDesktop) && !isEncryptedFolder && (
        <>
          <CreateOnlyOfficeItem
            fileClass="text"
            navigate={navigate}
            params={params}
          />
          <CreateOnlyOfficeItem
            fileClass="spreadsheet"
            navigate={navigate}
            params={params}
          />
          <CreateOnlyOfficeItem
            fileClass="slide"
            navigate={navigate}
            params={params}
          />
        </>
      )}
      {!isEncryptedFolder && (
        <CreateShortcut onCreated={refreshFolderContent} />
      )}
      {canUpload && <hr />}
      {canUpload && (
        <UploadItem
          disabled={isDisabled}
          onUploaded={refreshFolderContent}
          displayedFolder={displayedFolder}
        />
      )}
      {hasScanner && <ScannerMenuItem />}
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
  navigate,
  params,
  displayedFolder,
  ...actionMenuProps
}) => {
  return (
    <ActionMenu
      anchorElRef={anchorRef}
      onClose={handleClose}
      autoclose={true}
      popperOptions={{
        strategy: 'fixed'
      }}
      {...actionMenuProps}
    >
      <ActionMenuContent
        isDisabled={isDisabled}
        canCreateFolder={canCreateFolder}
        canUpload={canUpload}
        refreshFolderContent={refreshFolderContent}
        isPublic={isPublic}
        isEncryptedFolder={isEncryptedFolder}
        navigate={navigate}
        params={params}
        displayedFolder={displayedFolder}
      />
    </ActionMenu>
  )
}

export default AddMenu
