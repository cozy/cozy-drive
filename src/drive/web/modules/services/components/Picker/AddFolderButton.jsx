import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'cozy-ui/react'

const AddFolderButton = ({ addFolder }) => (
  <Button onClick={addFolder}>Nouveau dossier</Button>
)

const mapDispatchToPropsButton = (dispatch, ownProps) => ({
  addFolder: () => dispatch(showNewFolderInput())
})

export default connect(null, mapDispatchToPropsButton)(AddFolderButton)
