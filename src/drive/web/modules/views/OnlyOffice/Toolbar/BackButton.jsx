import React from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'

const _BackButton = ({ onClick }) => {
  return (
    <IconButton onClick={onClick} data-testid="onlyoffice-backButton">
      <Icon icon={PreviousIcon} />
    </IconButton>
  )
}

const BackButton = React.memo(_BackButton)

export default BackButton
