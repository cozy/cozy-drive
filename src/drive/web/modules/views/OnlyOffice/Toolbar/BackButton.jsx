import React from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PreviousIcon from 'cozy-ui/transpiled/react/Icons/Previous'

const BackButton = ({ onClick }) => {
  // TODO: remove u-ml-half-s when https://github.com/cozy/cozy-ui/issues/1808 is fixed
  return (
    <IconButton
      data-testid="onlyoffice-backButton"
      className="u-ml-half-s"
      onClick={onClick}
    >
      <Icon icon={PreviousIcon} />
    </IconButton>
  )
}

export default React.memo(BackButton)
