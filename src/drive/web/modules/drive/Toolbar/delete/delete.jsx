import compose from 'lodash/flowRight'
import React from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { withRouter } from 'react-router'

import { useClient } from 'cozy-client'
import { trashFiles } from 'drive/web/modules/actions/utils'

import DeleteConfirm from '../../DeleteConfirm'
import toolbarContainer from '../toolbar'

const EnhancedDeleteConfirm = ({ folder, router, ...rest }) => {
  const client = useClient()
  return (
    <DeleteConfirm
      files={[folder]}
      onConfirm={async () => {
        await trashFiles(client, [folder])

        router.push(`/folder/${folder.dir_id}`)
      }}
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
