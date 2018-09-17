import React from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import DeleteConfirm from '../../DeleteConfirm'

import { trashFiles } from 'drive/web/modules/navigation/duck'
import toolbarContainer from './toolbar'
const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = dispatch => ({
  trashFolder: folder =>
    dispatch(
      showModal(
        <DeleteConfirm
          files={[folder]}
          onConfirm={() =>
            dispatch(trashFiles([folder])).then(() => {
              console.log('should be redirected')
              // ownProps.router.push(`/folder/${folder.parent.id}`)
            })
          }
        />
      )
    )
})

const deleteContainer = component =>
  toolbarContainer(connect(mapStateToProps, mapDispatchToProps)(component))

export default deleteContainer
