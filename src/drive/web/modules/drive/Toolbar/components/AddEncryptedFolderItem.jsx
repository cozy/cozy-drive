import React from 'react'
import { connect } from 'react-redux'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import EncryptedFolderIcon from 'drive/web/modules/views/Folder/EncryptedFolderIcon'

import { useVaultUnlockContext } from 'cozy-keys-lib'

import {
  showNewFolderInput,
  encryptedFolder
} from 'drive/web/modules/filelist/duck'

const AddEncryptedFolderItem = translate()(({ t, addEncryptedFolder }) => {
  const { showUnlockForm } = useVaultUnlockContext()

  return (
    <ActionMenuItem
      data-test-id="add-encrypted-folder-link"
      onClick={() => showUnlockForm({ onUnlock: addEncryptedFolder })}
      left={<EncryptedFolderIcon size={16} />}
    >
      {t('toolbar.menu_new_encrypted_folder')}
    </ActionMenuItem>
  )
})
const mapDispatchToProps = dispatch => ({
  // An encrypted folder triggers a new encryption key generation
  addEncryptedFolder: () => {
    dispatch(encryptedFolder())
    dispatch(showNewFolderInput())
  }
})

export default connect(
  null,
  mapDispatchToProps
)(AddEncryptedFolderItem)
