import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { showModal } from 'react-cozy-helpers'

import DeleteConfirm from '../../DeleteConfirm'

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
