import React from 'react'
import { connect } from 'react-redux'
import { showModal } from 'react-cozy-helpers'
import { ShareModal } from 'sharing'
import buttonContainer from '../containers/button'

const mapDispatchToProps = (dispatch, ownProps) => ({
  share: displayedFolder =>
    dispatch(
      showModal(
        <ShareModal
          document={displayedFolder}
          documentType="Files"
          sharingDesc={displayedFolder.name}
        />
      )
    )
})

const shareContainer = component =>
  connect(null, mapDispatchToProps)(buttonContainer(component))

export default shareContainer
