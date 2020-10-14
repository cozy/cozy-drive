import React from 'react'
import cx from 'classnames'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import styles from 'drive/styles/actionmenu.styl'

export const ActionsItems = ({ actions, file, onClose }) => {
  const { t } = useI18n()
  let previousAction = ''
  const displayableActions = actions.filter(actionObject => {
    const actionDefinition = Object.values(actionObject)[0]
    return !(
      actionDefinition.displayCondition !== undefined &&
      !actionDefinition.displayCondition([file])
    )
  })
  // We need to clean Actions since action has a displayable
  // conditions and we can't know from the begining what the
  // behavior will be. For instance, we can't know that
  // hr will be the latest action in the sharing views for a
  // folder.
  // Or we can't know that we'll have two following hr if the
  // display condition for the actions between are true or false
  let cleanedActions = []
  displayableActions.map((actionObject, i) => {
    const actionName = Object.keys(actionObject)[0]
    if (previousAction === actionName) {
      previousAction = actionName
      return null
    } else {
      previousAction = actionName
    }
    if (actionName === 'hr' && i + 1 === displayableActions.length) {
      return null
    }
    cleanedActions.push(actionObject)
  })

  return cleanedActions.map((actionObject, i) => {
    const actionName = Object.keys(actionObject)[0]
    const actionDefinition = Object.values(actionObject)[0]

    if (actionName === 'hr') return <hr key={'hr' + i} />
    const Component = actionDefinition.Component
    const action = actionDefinition.action
    const onClick = action
      ? () => {
          const promise = action([file])
          onClose()
          return promise
        }
      : null
    return (
      <Component
        key={actionName + i}
        className={cx(styles['fil-action'], styles[`fil-action-${actionName}`])}
        onClick={onClick}
        files={[file]}
      >
        {t(
          `SelectionBar.${
            actionDefinition.label ? actionDefinition.label : actionName
          }`
        )}
      </Component>
    )
  })
}
