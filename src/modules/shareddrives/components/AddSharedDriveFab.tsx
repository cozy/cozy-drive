import React, { FC } from 'react'

import Fab from 'cozy-ui/transpiled/react/Fab'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

interface AddSharedDriveFabProps {
  onClick: () => void
}

const AddSharedDriveFab: FC<AddSharedDriveFabProps> = ({ onClick }) => {
  return (
    <div className="u-pos-absolute u-bottom-s u-right-s">
      <Fab color="primary" onClick={onClick}>
        <Icon icon={PlusIcon} />
      </Fab>
    </div>
  )
}

export default AddSharedDriveFab
