import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Icon } from 'cozy-ui/react'

import withSharingState from 'sharing/hoc/withSharingState'
import { uploadFiles } from 'drive/web/modules/navigation/duck'

const styles = {
  parent: {
    position: 'relative',
    overflow: 'hidden'
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 1
  }
}

const UploadButton = ({ label, disabled, onUpload, className }) => (
  <label
    role="button"
    disabled={disabled}
    className={className}
    style={styles.parent}
  >
    <span className="u-flex u-flex-items-center">
      <Icon icon="upload" />
      <span>{label}</span>
      <input
        data-test-id="upload-btn"
        type="file"
        multiple
        style={styles.input}
        disabled={disabled}
        onChange={e => {
          if (e.target.files) {
            onUpload(Array.from(e.target.files))
          }
        }}
      />
    </span>
  </label>
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
