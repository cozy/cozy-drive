import React from 'react'
import { Icon } from 'cozy-ui/react'

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
    <span>
      <Icon icon="upload" />
      <span>{label}</span>
      <input
        data-test-id="uploadButton"
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

export default UploadButton
