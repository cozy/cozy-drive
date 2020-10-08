import React from 'react'
import { connect } from 'react-redux'
import SelectionBar from 'cozy-ui/transpiled/react/SelectionBar'
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
)(({ selectionModeActive, actions, ...rest }) => {
  const convertedActions = DriveActionToSelectionBarAction(actions)
  return (
    <div style={{ display: selectionModeActive ? 'inherit' : 'none' }}>
      <SelectionBar actions={convertedActions} {...rest} />
    </div>
  )
})

const DriveActionToSelectionBarAction = driveActions => {
  let actions = {}
  driveActions.map(driveAction => {
    const actionName = Object.keys(driveAction)[0]
    if (actionName !== 'hr') {
      actions[actionName] = Object.values(driveAction)[0]
    }
  })
  return actions
}
