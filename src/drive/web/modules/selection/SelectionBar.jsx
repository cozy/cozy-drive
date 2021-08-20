import React from 'react'
import { connect } from 'react-redux'
import SelectionBar from 'cozy-ui/transpiled/react/SelectionBar'
import {
  getSelectedFiles,
  hideSelectionBar,
  isSelectionBarVisible
} from './duck'
import { getActionName } from 'drive/web/modules/actionmenu/ActionsItems'
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
  console.log('actions : ', actions)
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
    const actionName = getActionName(driveAction)
    const actionDefinition = Object.values(driveAction)[0]
    if (
      actionDefinition.displayInSelectionBar === undefined ||
      actionDefinition.displayInSelectionBar
    )
      actions[actionName] = actionDefinition
  })
  return actions
}
