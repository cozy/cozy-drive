import React from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { withRouter } from 'react-router'
import { trashFiles } from 'drive/web/modules/navigation/duck'

import DeleteConfirm from '../../DeleteConfirm'
import toolbarContainer from '../toolbar'
const mapStateToProps = () => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  trashFolder: folder =>
    dispatch(
      showModal(
        <DeleteConfirm
          files={[folder]}
          onConfirm={async () => {
            await dispatch(trashFiles([folder]))
            ownProps.router.push(`/folder/${folder.parent.id}`)
          }}
        />
      )
    )
})

const deleteContainer = component =>
  toolbarContainer(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(component)
    )
  )

export default deleteContainer
