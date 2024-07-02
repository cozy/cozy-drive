import React from 'react'

import ActionsBar from 'cozy-ui/transpiled/react/ActionsBar'

import { useSelectionContext } from 'modules/selection/SelectionProvider'

type DriveAction = Record<
  string,
  {
    displayInSelectionBar?: boolean
  }
>

const driveActionsToSelectionBarActions = (
  driveActions: DriveAction[]
): DriveAction[] => {
  return driveActions.filter(driveAction => {
    const action = Object.values(driveAction)[0]
    return (
      action.displayInSelectionBar === undefined || action.displayInSelectionBar
    )
  })
}

const SelectionBar: React.FC<{ actions?: DriveAction[] }> = ({ actions }) => {
  const { isSelectionBarVisible, hideSelectionBar, selectedItems } =
    useSelectionContext()

  if (isSelectionBarVisible && actions) {
    const convertedActions = driveActionsToSelectionBarActions(actions)

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
