import React, { forwardRef, useContext } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PlusIcon from 'cozy-ui/transpiled/react/Icons/Plus'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { AddMenuContext } from 'modules/drive/AddMenu/AddMenuProvider'

const makeComponent = (label, icon) => {
  const Component = forwardRef((props, ref) => {
    const addMenuCtx = useContext(AddMenuContext)
    const { a11y } = addMenuCtx

    return (
      <ActionsMenuItem
        {...props}
        onClick={() => props.onClick(addMenuCtx)}
        ref={ref}
        {...a11y}
      >
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
        <ListItemText primary={label} />
      </ActionsMenuItem>
    )
  })
  Component.displayName = 'AddItems'

  return Component
}

export const addItems = ({ t, hasWriteAccess }) => {
  const label = t('toolbar.menu_add_item')
  const icon = PlusIcon

  return {
    name: 'addItems',
    label,
    icon,
    displayCondition: () => hasWriteAccess,
    action: (_, { isOffline, handleOfflineClick, handleToggle }) => {
      return isOffline ? handleOfflineClick() : handleToggle()
    },
    Component: makeComponent(label, icon)
  }
}
