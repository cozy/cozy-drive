import compose from 'lodash/flowRight'
import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { withRouter } from 'react-router'

import DeleteConfirm from '../../DeleteConfirm'
import toolbarContainer from '../toolbar'

const EnhancedDeleteConfirm = ({ folder, router, ...rest }) => {
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

const mapDispatchToProps = (dispatch, ownProps) => ({
  trashFolder: folder =>
    dispatch(
      showModal(
        <EnhancedDeleteConfirm
          folder={folder}
          dispatch={dispatch}
          router={ownProps.router}
        />
      )
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
