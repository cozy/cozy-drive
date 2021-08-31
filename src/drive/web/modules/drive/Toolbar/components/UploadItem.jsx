import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import { translate } from 'cozy-ui/transpiled/react'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'

import { uploadFiles } from 'drive/web/modules/navigation/duck'
import toolbarContainer from '../toolbar'

const UploadItem = ({ t, isDisabled, onUpload }) => (
  <FileInput
    label={t('toolbar.menu_upload')}
    disabled={isDisabled}
    multiple
    onChange={onUpload}
    data-test-id="upload-btn"
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

const mapDispatchToProps = (
  dispatch,
  { displayedFolder, sharingState, encryptionKey, onUploaded }
) => ({
  onUpload: files => {
    dispatch(
      uploadFiles(
        files,
        displayedFolder.id,
        sharingState,
        encryptionKey,
        onUploaded
      )
    )
  }
})

export default compose(
  withSharingState,
  toolbarContainer,
  translate(),
  connect(
    null,
    mapDispatchToProps
  )
)(UploadItem)
