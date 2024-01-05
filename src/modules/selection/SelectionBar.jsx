import React from 'react'
import SelectionBarUI from 'cozy-ui/transpiled/react/SelectionBar'
import { useSelectionContext } from 'modules/selection/SelectionProvider'

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

const SelectionBar = ({ actions }) => {
  const { isSelectionBarVisible, hideSelectionBar, selectedItems } =
    useSelectionContext()
  const convertedActions = driveActionsToSelectionBarActions(actions)

  if (isSelectionBarVisible) {
    return (
      <SelectionBarUI
        actions={convertedActions}
        selected={selectedItems}
        hideSelectionBar={hideSelectionBar}
      />
    )
  }

  return null
}

export default SelectionBar
