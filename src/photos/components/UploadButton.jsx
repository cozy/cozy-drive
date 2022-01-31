import cx from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'

import { Icon, FileInput } from 'cozy-ui/transpiled/react'
import UploadIcon from 'cozy-ui/transpiled/react/Icons/Upload'

import button from '../styles/toolbar.styl'

const UploadButton = ({ label, inMenu, disabled, onUpload, className }) => (
  <FileInput
    accept="image/*"
    className={cx(className, { [`${button['c-btn']}`]: !inMenu })}
    data-testid="upload-btn"
    disabled={disabled}
    multiple
    onChange={onUpload}
    value={[]} // always erase the value to be able to re-upload the same file
  >
    <span>
      {!inMenu && <Icon icon={UploadIcon} />}
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
