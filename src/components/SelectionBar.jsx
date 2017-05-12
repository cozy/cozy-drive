import styles from '../styles/selectionbar'

import React from 'react'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

const SelectionBar = ({ t, selected, actions, single, mobile, onClose, onMoreClick }) => {
  const selectedCount = selected.length
  const enableActions = actions.filter(action => {
    return action.displayCondition === undefined || action.displayCondition(selected)
  })
  const actionNames = Object.keys(enableActions)
  return (
    <div className={styles['coz-selectionbar']} role='toolbar'>
      <span className={styles['coz-selectionbar-count']}>
        {selectedCount}
        <span> {t('selectionbar.selected_count', { smart_count: selectedCount })}</span>
      </span>
      <span className={styles['coz-selectionbar-separator']} />
      {actionNames.map(actionName => (
        <button
          className={styles['coz-action-' + actionName.toLowerCase()]}
          disabled={selectedCount < 1}
          onClick={() => actions[actionName].action(selected)}
        >
          {t('selectionbar.' + actionName)}
        </button>
      ))}
      {actionNames.length > 4 &&
        <button
          className={classNames('coz-btn', 'coz-btn--extra-white')}
          disabled={selectedCount < 1}
          onClick={onMoreClick}
        />}
      <button className={styles['coz-action-close']} onClick={onClose}>
        {t('selectionbar.close')}
      </button>
    </div>
  )
}

export default translate()(SelectionBar)
