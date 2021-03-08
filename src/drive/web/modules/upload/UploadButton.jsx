import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'

import withSharingState from 'cozy-sharing/dist/hoc/withSharingState'
import { Icon, FileInput } from 'cozy-ui/transpiled/react'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'

import { uploadFiles } from 'drive/web/modules/navigation/duck'

const UploadButton = ({ label, disabled, onUpload, className }) => (
  <FileInput
    className={className}
    label={label}
    disabled={disabled}
    multiple
    onChange={onUpload}
    data-test-id="upload-btn"
    value={[]} // always erase the value to be able to re-upload the same file
  >
    <span>
      <Icon icon={UploadIcon} />
      <span>{label}</span>
    </span>
  </FileInput>
)

UploadButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onUpload: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  displayedFolder: PropTypes.object.isRequired, // io.cozy.files
  // in case of upload conflicts, shared files are not overridden
  sharingState: PropTypes.object.isRequired
}

UploadButton.defaultProps = {
  disabled: false
}

const mapDispatchToProps = (dispatch, { displayedFolder, sharingState }) => ({
  onUpload: files => {
    dispatch(uploadFiles(files, displayedFolder.id, sharingState))
  }
})

export default compose(
  withSharingState,
  connect(
    null,
    mapDispatchToProps
  )
)(UploadButton)
