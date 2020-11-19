import React, { useMemo } from 'react'
import cx from 'classnames'

import styles from 'drive/styles/actionmenu.styl'

export const getActionName = actionObject => {
  return Object.keys(actionObject)[0]
}

// We need to clean Actions since action has a displayable
// conditions and we can't know from the begining what the
// behavior will be. For instance, we can't know that
// hr will be the latest action in the sharing views for a
// folder.
// Or we can't know that we'll have two following hr if the
// display condition for the actions between are true or false
export const getOnlyNeededActions = (actions, file) => {
  let previousAction = ''
  const displayableActions = actions.filter(actionObject => {
    const actionDefinition = Object.values(actionObject)[0]
    return (
      !actionDefinition.displayCondition ||
      actionDefinition.displayCondition([file])
    )
  })
  let cleanedActions = []
  displayableActions.map(actionObject => {
    const actionName = getActionName(actionObject)
    if (previousAction === actionName) {
      previousAction = actionName
      return null
    } else {
      previousAction = actionName
    }
    cleanedActions.push(actionObject)
  })
  // We don't want to have an hr as the latest actions available
  while (getActionName(cleanedActions[cleanedActions.length - 1]) === 'hr') {
    cleanedActions.pop()
  }
  return cleanedActions
}

/**
 *
 * ActionsItems only shows `actions` that are  suitable for the given
 * `file`.
 */
export const ActionsItems = ({ actions, file, onClose }) => {
  const cleanedActions = useMemo(() => getOnlyNeededActions(actions, file), [
    actions,
    file
  ])

  return cleanedActions.map((actionObject, i) => {
    const actionName = getActionName(actionObject)
    const actionDefinition = Object.values(actionObject)[0]

    const Component = actionDefinition.Component
    const action = actionDefinition.action

    const onClick = action
      ? () => {
          action([file])
          onClose()
        }
      : null
    return (
      <div
        className={cx(
          'u-pos-relative',
          styles['fil-action'],
          styles[`fil-action-${actionName}`]
        )}
        key={actionName + i}
      >
        <Component onClick={onClick} files={[file]} />
      </div>
    )
  })
}
