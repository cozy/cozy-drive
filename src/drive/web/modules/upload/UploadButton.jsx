import React from 'react'
import { Icon } from 'cozy-ui/react'

const styles = {
  parent: {
    position: 'relative',
    width: '100%',
    boxSizing: 'border-box'
  },
  input: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    cursor: 'pointer'
  }
}

const UploadButton = ({ label, disabled, onUpload, className }) => (
  <label
    role="button"
    disabled={disabled}
    className={className}
    style={styles.parent}
  >
    <span
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Icon icon="upload" />
      <span>{label}</span>
      <input
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
