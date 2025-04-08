import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'
import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import Icon from 'cozy-ui/transpiled/react/Icon'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import { useDisplayedFolder } from '@/hooks'
import { uploadFiles } from '@/modules/navigation/duck'

const UploadItem = ({ t, isDisabled, onUpload, onClick }) => {
  const client = useClient()
  const vaultClient = useVaultClient()
  const { showAlert } = useAlert()
  const { initialDirId } = useDisplayedFolder()

  const handleClick = evt => {
    evt.stopPropagation()
  }
  const handleChange = files => {
    onUpload(client, vaultClient, files, initialDirId, showAlert)
    onClick()
  }

  return (
    <FileInput
      label={t('toolbar.menu_upload')}
      disabled={isDisabled}
      multiple
      onChange={handleChange}
      data-testid="upload-btn"
      value={[]}
      // FileInput needs to stay rendered until the onChange event, so we prevent the event from bubbling
      onClick={handleClick}
    >
      <ActionsMenuItem onClick={handleClick}>
        <ListItemIcon>
          <Icon icon={UploadIcon} />
        </ListItemIcon>
        <ListItemText primary={t('toolbar.menu_upload')} />
      </ActionsMenuItem>
    </FileInput>
  )
}

const mapDispatchToProps = (dispatch, { sharingState, onUploaded, t }) => ({
  onUpload: (client, vaultClient, files, initialDirId, showAlert) => {
    dispatch(
      uploadFiles(files, initialDirId, sharingState, onUploaded, {
        client,
        vaultClient,
        showAlert,
        t
      })
    )
  }
})

export default compose(
  withSharingState,
  translate(),
  connect(null, mapDispatchToProps)
)(UploadItem)
