import cx from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import { Icon, FileInput } from 'cozy-ui/react'

import button from '../styles/toolbar.styl'

const UploadButton = ({ label, inMenu, disabled, onUpload, className }) => (
  <FileInput
    accept="image/*"
    className={cx(className, { [`${button['c-btn']}`]: !inMenu })}
    disabled={disabled}
    multiple
    onChange={onUpload}
  >
    <span data-test-id="upload-btn">
      {!inMenu && <Icon icon="upload" />}
      <span>{label}</span>
    </span>
  </FileInput>
)

UploadButton.propTypes = {
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  inMenu: PropTypes.bool,
  onUpload: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
}

UploadButton.defaultProps = {
  disabled: false,
  inMenu: false
}

export default UploadButton
