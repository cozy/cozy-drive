import React from 'react'
import PropTypes from 'prop-types'

import Button from 'cozy-ui/transpiled/react/Button'

const areTargetsInCurrentDir = (targets, currentDirId) => {
  const targetsInCurrentDir = targets.filter(
    target => target.dir_id === currentDirId
  )
  return targetsInCurrentDir.length === targets.length
}

const Footer = (
  {
    onConfirm,
    onClose,
    targets,
    currentDirId,
    isMoving,
    primaryTextAction,
    secondaryTextAction
  },
  { t }
) => {
  const primaryText = primaryTextAction ? primaryTextAction : t('Move.action')
  const secondaryText = secondaryTextAction
    ? secondaryTextAction
    : t('Move.cancel')

  return (
    <>
      <Button label={secondaryText} theme="secondary" onClick={onClose} />
      <Button
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
Footer.contextTypes = {
  t: PropTypes.func.isRequired
}
Footer.defaultProps = {
  isMoving: false
}

export default Footer
