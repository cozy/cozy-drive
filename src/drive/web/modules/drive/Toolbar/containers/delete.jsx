import React from 'react'
import { connect } from 'react-redux'
import { ROOT_DIR_ID } from 'drive/constants/config'
import { showModal } from 'react-cozy-helpers'
import DeleteConfirm from '../../DeleteConfirm'

import { trashFiles } from 'drive/web/modules/navigation/duck'

const mapStateToProps = (state, ownProps) => ({
  displayedFolder: state.view.displayedFolder,
  notRootfolder:
    state.view.displayedFolder && state.view.displayedFolder.id !== ROOT_DIR_ID
})

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

const buttonContainer = component =>
  connect(mapStateToProps, mapDispatchToProps)(component)

export default buttonContainer
