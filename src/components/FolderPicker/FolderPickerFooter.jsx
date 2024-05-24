import PropTypes from 'prop-types'
import React from 'react'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { areTargetsInCurrentDir } from 'modules/move/helpers'

/**
 * List of actions for the move modal
 */
const FolderPickerFooter = ({
  onConfirm,
  onClose,
  targets,
  currentDirId,
  isMoving,
  confirmLabel,
  cancelLabel,
  isLoading
}) => {
  const { t } = useI18n()
  const primaryText = confirmLabel ? confirmLabel : t('Move.action')
  const secondaryText = cancelLabel ? cancelLabel : t('Move.cancel')

  const handleClick = () => {
    onConfirm(currentDirId)
  }

  return (
    <>
      <Buttons variant="secondary" label={secondaryText} onClick={onClose} />
      <Buttons
        label={primaryText}
        onClick={handleClick}
        disabled={
          areTargetsInCurrentDir(targets, currentDirId) || isMoving || isLoading
        }
        busy={isMoving || isLoading}
      />
    </>
  )
}

FolderPickerFooter.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  currentDirId: PropTypes.string.isRequired,
  isMoving: PropTypes.bool,
  primaryTextAction: PropTypes.string,
  secondaryTextAction: PropTypes.string,
  isLoading: PropTypes.bool
}

FolderPickerFooter.defaultProps = {
  isMoving: false,
  isLoading: false
}

export { FolderPickerFooter }
