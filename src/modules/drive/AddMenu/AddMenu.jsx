import React from 'react'

import ActionsMenu from 'cozy-ui/transpiled/react/ActionsMenu'

import AddMenuContent from '@/modules/drive/AddMenu/AddMenuContent'

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
      <AddMenuContent
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
