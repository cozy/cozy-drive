import React from 'react'
import { useDispatch } from 'react-redux'

import { SharedDriveModal } from 'cozy-sharing'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'

import { showModal } from '@/lib/react-cozy-helpers'

const CreateSharedDriveButton = ({ className, variant, label }) => {
  const dispatch = useDispatch()

  return (
    <Button
      className={className}
      variant={variant}
      startIcon={<Icon icon={PlusIcon} />}
      label={label}
      onClick={() => dispatch(showModal(<SharedDriveModal />))}
    />
  )
}

export default CreateSharedDriveButton
