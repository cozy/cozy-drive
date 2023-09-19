import React from 'react'

import { isMobileApp } from 'cozy-device-helper'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import ActionMenu from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Typography from 'cozy-ui/transpiled/react/Typography'

import AddFolderItem from 'drive/web/modules/drive/Toolbar/components/AddFolderItem'
import AddEncryptedFolderItem from 'drive/web/modules/drive/Toolbar/components/AddEncryptedFolderItem'
import CreateNoteItem from 'drive/web/modules/drive/Toolbar/components/CreateNoteItem'
import CreateShortcut from 'drive/web/modules/drive/Toolbar/components/CreateShortcut'
import UploadItem from 'drive/web/modules/drive/Toolbar/components/UploadItem'
import StartScanner from 'drive/web/modules/drive/Toolbar/components/StartScanner'
import CreateOnlyOfficeItem from 'drive/web/modules/drive/Toolbar/components/CreateOnlyOfficeItem'
import { isOfficeEditingEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import flag from 'cozy-flags'

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
      {isMobileApp() && canUpload && <StartScanner disabled={isDisabled} />}
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
