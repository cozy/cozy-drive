import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'cozy-ui/react'

const PdfToolbarButton = ({ icon, onClick, disabled }) => (
  <Button
    iconOnly
    subtle
    theme="secondary"
    className="u-p-half u-m-half"
    icon={icon}
    onClick={onClick}
    disabled={disabled}
  />
)

PdfToolbarButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default PdfToolbarButton
