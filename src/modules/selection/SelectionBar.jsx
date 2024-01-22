import React from 'react'

import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'

import { useSelectionContext } from 'modules/selection/SelectionProvider'

const driveActionsToSelectionBarActions = driveActions => {
  return driveActions.filter(driveAction => {
    const action = Object.values(driveAction)[0]
    return (
      action.displayInSelectionBar === undefined || action.displayInSelectionBar
    )
  })
}

const SelectionBar = ({ actions }) => {
  const { isSelectionBarVisible, hideSelectionBar, selectedItems } =
    useSelectionContext()
  const convertedActions = driveActionsToSelectionBarActions(actions)

  if (isSelectionBarVisible) {
    return (
      <ActionsBar
        actions={convertedActions}
        docs={selectedItems}
        onClose={hideSelectionBar}
      />
    )
  }

  return null
}

export default SelectionBar
