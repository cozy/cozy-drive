import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { Icon } from 'cozy-ui/react'
import classNames from 'classnames'

import button from '../styles/toolbar'

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

export const UploadButton = ({
  t,
  label,
  type = 'button',
  disabled,
  onUpload,
  className = ''
}) => (
  <label
    role="button"
    disabled={disabled}
    className={`${className} ${type === 'menu-item' ? '' : button['c-btn']}`}
    style={styles.parent}
  >
    <Icon icon="upload" />
    {label}
    <input
      type="file"
      accept="image/*"
      multiple
      disabled={disabled}
      style={styles.input}
      onChange={e => {
        // e.target.files is an array-like, transform it to Array instance
        const photosArray = Array.from(e.target.files)
        onUpload(photosArray)
      }}
    />
  </label>
)

export default translate()(UploadButton)
