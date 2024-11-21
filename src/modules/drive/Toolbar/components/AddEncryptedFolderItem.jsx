import React from 'react'
import { connect } from 'react-redux'

import { useVaultUnlockContext } from 'cozy-keys-lib'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { showNewFolderInput, encryptedFolder } from 'modules/filelist/duck'
import EncryptedFolderIcon from 'modules/views/Folder/EncryptedFolderIcon'

const AddEncryptedFolderItem = ({ addEncryptedFolder, onClick }) => {
  const { t } = useI18n()
  const { showUnlockForm } = useVaultUnlockContext()

  const handleClick = () => {
    showUnlockForm({ onUnlock: addEncryptedFolder })
    onClick()
  }

  return (
    <ActionsMenuItem
      data-testid="add-encrypted-folder-link"
      onClick={handleClick}
    >
      <EncryptedFolderIcon width={16} height={16} />
      <ListItemText primary={t('toolbar.menu_new_encrypted_folder')} />
    </ActionsMenuItem>
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
