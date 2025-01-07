import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import DeleteConfirm from '../../DeleteConfirm'

import { showModal } from '@/lib/react-cozy-helpers'

const EnhancedDeleteConfirm = ({ folder, ...rest }) => {
  const navigate = useNavigate()

  const navigateToParentFolder = useCallback(
    () => navigate(`/folder/${folder.dir_id}`),
    [navigate, folder]
  )

  return (
    <DeleteConfirm
      files={[folder]}
      afterConfirmation={navigateToParentFolder}
      {...rest}
    />
  )
}

export { EnhancedDeleteConfirm }

const mapDispatchToProps = dispatch => ({
  trashFolder: folder =>
    dispatch(showModal(<EnhancedDeleteConfirm folder={folder} />))
})

const deleteContainer = connect(null, mapDispatchToProps)

export default deleteContainer
