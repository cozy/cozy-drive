import PropTypes from 'prop-types'
import React from 'react'

import Buttons from 'cozy-ui/transpiled/react/Buttons'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { areTargetsInCurrentDir } from 'components/FolderPicker/helpers'

/**
 * List of actions for the move modal
 */
const FolderPickerFooter = ({
  onConfirm,
  onClose,
  targets,
  folder,
  isBusy,
  confirmLabel,
  cancelLabel
}) => {
  const { t } = useI18n()
  const primaryText = confirmLabel ? confirmLabel : t('Move.action')
  const secondaryText = cancelLabel ? cancelLabel : t('Move.cancel')

  const handleClick = () => {
    onConfirm(folder)
  }
  const isDisabled =
    areTargetsInCurrentDir(targets, folder) || isBusy || folder === undefined

  return (
    <>
      <Buttons variant="secondary" label={secondaryText} onClick={onClose} />
      <Buttons
        label={primaryText}
        onClick={handleClick}
        disabled={isDisabled}
        busy={isBusy}
      />
    </>
  )
}

FolderPickerFooter.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  targets: PropTypes.array.isRequired,
  folder: PropTypes.object,
  isBusy: PropTypes.bool,
  primaryTextAction: PropTypes.string,
  secondaryTextAction: PropTypes.string
}

FolderPickerFooter.defaultProps = {
  isBusy: false
}

export { FolderPickerFooter }
