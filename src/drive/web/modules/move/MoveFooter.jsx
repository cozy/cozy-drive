import React from 'react'
import PropTypes from 'prop-types'
import { ModalFooter, Button } from 'cozy-ui/react'

const areTargetsInCurrentDir = (targets, currentDirId) => {
  const targetsInCurrentDir = targets.filter(
    target => target.dir_id === currentDirId
  )

  return targetsInCurrentDir.length === targets.length
}

const MoveFooter = ({ onConfirm, onClose, targets, currentDirId }, { t }) => (
  <ModalFooter hasButtonChildren>
    <Button label={t('Move.cancel')} theme="secondary" onClick={onClose} />
    <Button
      label={t('Move.action')}
      onClick={onConfirm}
      disabled={areTargetsInCurrentDir(targets, currentDirId)}
    />
  </ModalFooter>
)

MoveFooter.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  currentDirId: PropTypes.string.isRequired
}

export default MoveFooter
