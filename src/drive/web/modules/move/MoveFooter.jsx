import React from 'react'
import PropTypes from 'prop-types'
import { ModalFooter, ModalButtons, Button } from 'cozy-ui/react'

const areTargetsInCurrentDir = (targets, currentDirId) => {
  const targetsInCurrentDir = targets.filter(
    target => target.dir_id === currentDirId
  )

  return targetsInCurrentDir.length === targets.length
}

const MoveFooter = (
  { onConfirm, onClose, targets, currentDirId, isMoving },
  { t }
) => (
  <ModalFooter>
    <ModalButtons>
      <Button label={t('Move.cancel')} theme="secondary" onClick={onClose} />
      <Button
        label={t('Move.action')}
        onClick={onConfirm}
        disabled={areTargetsInCurrentDir(targets, currentDirId) || isMoving}
        busy={isMoving}
      />
    </ModalButtons>
  </ModalFooter>
)

MoveFooter.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  currentDirId: PropTypes.string.isRequired,
  isMoving: PropTypes.bool
}

MoveFooter.defaultProps = {
  isMoving: false
}

export default MoveFooter
