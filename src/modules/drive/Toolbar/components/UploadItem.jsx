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
import { useUploadContext } from '@/modules/upload/UploadProvider'

const UploadItem = ({
  t,
  isDisabled,
  onUpload,
  onClick,
  isReadOnly,
  displayedFolder
}) => {
  const client = useClient()
  const vaultClient = useVaultClient()
  const { showAlert } = useAlert()
  const { initialDirId } = useDisplayedFolder()
  const { addNewItems } = useUploadContext()

  const handleMenuItemClick = evt => {
    if (isReadOnly) {
      evt.preventDefault()
      evt.stopPropagation()

      showAlert({
        message: t(
          'AddMenu.readOnlyFolder',
          'This is a read-only folder. You cannot perform this action.'
        ),
        severity: 'warning'
      })
      onClick()
      return
    }
  }

  const handleChange = files => {
    if (isReadOnly || !files || files.length === 0) return

    onUpload(
      client,
      vaultClient,
      files,
      initialDirId,
      showAlert,
      displayedFolder?.driveId,
      addNewItems
    )
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
    >
      <ActionsMenuItem onClick={handleMenuItemClick}>
        <ListItemIcon>
          <Icon icon={UploadIcon} />
        </ListItemIcon>
        <ListItemText primary={t('toolbar.menu_upload')} />
      </ActionsMenuItem>
    </FileInput>
  )
}

const mapDispatchToProps = (dispatch, { sharingState, onUploaded, t }) => ({
  onUpload: (
    client,
    vaultClient,
    files,
    initialDirId,
    showAlert,
    driveId,
    addNewItems
  ) => {
    dispatch(
      uploadFiles(
        files,
        initialDirId,
        sharingState,
        onUploaded,
        {
          client,
          vaultClient,
          showAlert,
          t
        },
        driveId,
        addNewItems
      )
    )
  }
})

export default compose(
  withSharingState,
  translate(),
  connect(null, mapDispatchToProps)
)(UploadItem)
