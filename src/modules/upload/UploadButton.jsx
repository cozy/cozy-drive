import PropTypes from 'prop-types'
import React from 'react'
import { useDispatch } from 'react-redux'

import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import FileInput from 'cozy-ui/transpiled/react/FileInput'
import Icon from 'cozy-ui/transpiled/react/Icon'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { uploadFiles } from '@/modules/navigation/duck'

const UploadButton = ({
  label,
  disabled,
  className,
  displayedFolder,
  sharingState,
  onUploaded
}) => {
  const { showAlert } = useAlert()
  const { t } = useI18n()
  const dispatch = useDispatch()

  const onUpload = (files, showAlert) => {
    dispatch(
      uploadFiles(files, displayedFolder.id, sharingState, onUploaded, {
        showAlert,
        t
      })
    )
  }

  return (
    <FileInput
      className={className}
      label={label}
      disabled={disabled}
      multiple
      onChange={files => onUpload(files, showAlert)}
      data-testid="upload-btn"
      value={[]} // always erase the value to be able to re-upload the same file
    >
      <span>
        <Icon icon={UploadIcon} />
        <span>{label}</span>
      </span>
    </FileInput>
  )
}

UploadButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string.isRequired,
  onUploaded: PropTypes.func,
  displayedFolder: PropTypes.object.isRequired, // io.cozy.files
  // in case of upload conflicts, shared files are not overridden
  sharingState: PropTypes.object.isRequired
}

UploadButton.defaultProps = {
  disabled: false
}

export default withSharingState(UploadButton)
