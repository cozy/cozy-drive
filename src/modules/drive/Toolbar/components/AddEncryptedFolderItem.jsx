import React from 'react'
import { connect } from 'react-redux'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import EncryptedFolderIcon from 'modules/views/Folder/EncryptedFolderIcon'
import { useVaultUnlockContext } from 'cozy-keys-lib'
import { showNewFolderInput, encryptedFolder } from 'modules/filelist/duck'

const AddEncryptedFolderItem = ({ addEncryptedFolder }) => {
  const { t } = useI18n()
  const { showUnlockForm } = useVaultUnlockContext()

  return (
    <ActionMenuItem
      data-testid="add-encrypted-folder-link"
      onClick={() => showUnlockForm({ onUnlock: addEncryptedFolder })}
      left={<EncryptedFolderIcon width={16} height={16} />}
    >
      {t('toolbar.menu_new_encrypted_folder')}
    </ActionMenuItem>
  )
}

const mapDispatchToProps = dispatch => ({
  // An encrypted folder triggers a new encryption key generation
  addEncryptedFolder: () => {
    dispatch(encryptedFolder())
    dispatch(showNewFolderInput())
  }
})

export default connect(null, mapDispatchToProps)(AddEncryptedFolderItem)
