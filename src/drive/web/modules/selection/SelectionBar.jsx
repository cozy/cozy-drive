import React from 'react'
import { connect } from 'react-redux'
import SelectionBar from 'cozy-ui/react/SelectionBar'
import {
  getSelectedFiles,
  hideSelectionBar,
  isSelectionBarVisible
} from './duck'

const mapStateToProps = state => ({
  selected: getSelectedFiles(state),
  selectionModeActive: isSelectionBarVisible(state)
})

const mapDispatchToProps = dispatch => ({
  hideSelectionBar: () => dispatch(hideSelectionBar())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(({ selectionModeActive, ...rest }) => (
  <div style={{ display: selectionModeActive ? 'inherit' : 'none' }}>
    <SelectionBar {...rest} />
  </div>
))
