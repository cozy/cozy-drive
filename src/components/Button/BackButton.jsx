import React from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'

export const BackButton = ({ onClick, t, ...props }) => {
  return (
    <IconButton onClick={onClick} {...props} aria-label={t('button.back')}>
      <Icon icon={PreviousIcon} />
    </IconButton>
  )
}

export default BackButton
