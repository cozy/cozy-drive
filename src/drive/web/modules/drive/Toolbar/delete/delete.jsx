import compose from 'lodash/flowRight'
import React from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { withRouter } from 'react-router'

import flag from 'cozy-flags'
import { useClient } from 'cozy-client'
import { trashFiles } from 'drive/web/modules/navigation/duck'
import { trashFiles as trashFilesV2 } from 'drive/web/modules/actions/utils'

import DeleteConfirm from '../../DeleteConfirm'
import toolbarContainer from '../toolbar'

const EnhancedDeleteConfirm = ({ folder, dispatch, router, ...rest }) => {
  const client = useClient()
  return (
    <DeleteConfirm
      files={[folder]}
      onConfirm={async () => {
        if (flag('drive.client-migration.enabled')) {
          await trashFilesV2(client, [folder])
        } else {
          await dispatch(trashFiles([folder]))
        }
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
