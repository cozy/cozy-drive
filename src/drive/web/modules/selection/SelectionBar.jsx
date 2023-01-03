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
  const convertedActions = driveActionsToSelectionBarActions(actions)
  const style = selectionModeActive ? {} : { display: 'none' }
  return (
    <div style={style}>
      <SelectionBar actions={convertedActions} {...rest} />
    </div>
  )
})

const driveActionsToSelectionBarActions = driveActions => {
  let actions = {}

  driveActions.forEach(driveAction => {
    const action = Object.values(driveAction)[0]
    if (
      action.displayInSelectionBar === undefined ||
      action.displayInSelectionBar
    )
      actions[action.name] = action
  })
  return actions
}
