import React, { forwardRef } from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import IconButton from 'cozy-ui/transpiled/react/IconButton'
import DotsIcon from 'cozy-ui/transpiled/react/Icons/Dots'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const FileAction = forwardRef(function FileAction({ onClick, disabled }, ref) {
  const { t } = useI18n()
  return (
    <ListItemIcon>
      <IconButton
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        arial-label={t('Toolbar.more')}
      >
        <Icon icon={DotsIcon} />
      </IconButton>
    </ListItemIcon>
  )
})

export default FileAction
