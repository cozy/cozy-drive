import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import { useClient } from 'cozy-client'
import { useVaultClient } from 'cozy-keys-lib'

import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'

import { uploadFiles } from 'drive/web/modules/navigation/duck'

const UploadItem = ({ t, isDisabled, onUpload, displayedFolder }) => {
  const client = useClient()
  const vaultClient = useVaultClient()
  return (
    <FileInput
      label={t('toolbar.menu_upload')}
      disabled={isDisabled}
      multiple
      onChange={files => onUpload(client, vaultClient, files, displayedFolder)}
      data-testid="upload-btn"
      value={[]}
      // FileInput needs to stay rendered until the onChange event, so we prevent the event from bubbling
      onClick={e => e.stopPropagation()}
    >
      <ActionMenuItem
        left={<Icon icon={UploadIcon} />}
        onClick={e => e.stopPropagation()}
      >
        {t('toolbar.menu_upload')}
      </ActionMenuItem>
    </FileInput>
  )
}

const mapDispatchToProps = (dispatch, { sharingState, onUploaded, t }) => ({
  onUpload: (client, vaultClient, files, displayedFolder) => {
    dispatch(
      uploadFiles(files, displayedFolder.id, sharingState, onUploaded, {
        client,
        vaultClient,
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
