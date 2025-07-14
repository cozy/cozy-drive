import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckSquareIcon from 'cozy-ui/transpiled/react/Icons/CheckSquare'
import CheckboxIcon from 'cozy-ui/transpiled/react/Icons/Checkbox'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const makeComponent = (label, icon) => {
  const Component = forwardRef((props, ref) => {
    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'SelectAllItems'

  return Component
}

export const selectAllItems = ({ t, selectAll, isSelectAll }) => {
  const label = isSelectAll
    ? t('toolbar.clear_selection')
    : t('toolbar.select_all')
  const icon = isSelectAll ? CheckSquareIcon : CheckboxIcon

  return {
    name: 'selectAllItems',
    label,
    icon,
    displayCondition: files => files.length > 0,
    action: () => selectAll(),
    Component: makeComponent(label, icon)
  }
}
