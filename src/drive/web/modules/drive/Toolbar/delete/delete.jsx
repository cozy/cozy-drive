import compose from 'lodash/flowRight'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { withRouter } from 'react-router'
import { useRouter } from 'drive/lib/RouterContext'

import DeleteConfirm from '../../DeleteConfirm'
import toolbarContainer from '../toolbar'

const EnhancedDeleteConfirm = ({ folder, ...rest }) => {
  const { router } = useRouter()
  const navigateToParentFolder = useCallback(
    () => router.push(`/folder/${folder.dir_id}`),
    [router, folder]
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
    dispatch(
      showModal(<EnhancedDeleteConfirm folder={folder} dispatch={dispatch} />)
    )
})

const deleteContainer = compose(
  toolbarContainer,
  withRouter,
  connect(
    null,
    mapDispatchToProps
  )
)

export default deleteContainer
