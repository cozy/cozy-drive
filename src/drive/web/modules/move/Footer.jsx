import React from 'react'
import PropTypes from 'prop-types'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react'

import { areTargetsInCurrentDir } from 'drive/web/modules/move/helpers'

/**
 * List of actions for the move modal
 */
const Footer = ({
  onConfirm,
  onClose,
  targets,
  currentDirId,
  isMoving,
  primaryTextAction,
  secondaryTextAction
}) => {
  const { t } = useI18n()
  const primaryText = primaryTextAction ? primaryTextAction : t('Move.action')
  const secondaryText = secondaryTextAction
    ? secondaryTextAction
    : t('Move.cancel')

  return (
    <>
      <Buttons variant="secondary" label={secondaryText} onClick={onClose} />
      <Buttons
        label={primaryText}
        onClick={onConfirm}
        disabled={areTargetsInCurrentDir(targets, currentDirId) || isMoving}
        busy={isMoving}
      />
    </>
  )
}

Footer.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  currentDirId: PropTypes.string.isRequired,
  isMoving: PropTypes.bool,
  primaryTextAction: PropTypes.string,
  secondaryTextAction: PropTypes.string
}

Footer.defaultProps = {
  isMoving: false
}

export default Footer
