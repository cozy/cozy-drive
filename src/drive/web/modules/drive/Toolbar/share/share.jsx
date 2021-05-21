import React from 'react'
import { connect } from 'react-redux'

import { showModal } from 'react-cozy-helpers'
import { ShareModal } from 'cozy-sharing'

import toolbarContainer from '../toolbar'

const mapDispatchToProps = dispatch => ({
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
  connect(
    null,
    mapDispatchToProps
  )(toolbarContainer(component))

export default shareContainer
