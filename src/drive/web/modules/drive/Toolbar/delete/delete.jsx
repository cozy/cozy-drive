import compose from 'lodash/flowRight'
import React from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { withRouter } from 'react-router'
import { trashFiles } from 'drive/web/modules/navigation/duck'

import DeleteConfirm from '../../DeleteConfirm'
import toolbarContainer from '../toolbar'

const EnhancedDeleteConfirm = ({ folder, dispatch, router }) => {
  return (
    <DeleteConfirm
      files={[folder]}
      onConfirm={async () => {
        await dispatch(trashFiles([folder]))
        router.push(`/folder/${folder.parent.id}`)
      }}
    />
  )
}

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
