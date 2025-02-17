import React, { forwardRef } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const FileActionVz = forwardRef(function FileAction(
  { onClick, disabled },
  ref
) {
  const { t } = useI18n()
  return (
    <IconButton
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      arial-label={t('Toolbar.more')}
    >
      <Icon icon={DotsIcon} />
    </IconButton>
  )
})

export default FileActionVz
