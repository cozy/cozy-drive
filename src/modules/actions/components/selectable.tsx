import React, { forwardRef } from 'react'

import { Action } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CheckSquareIcon from 'cozy-ui/transpiled/react/Icons/CheckSquare'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

interface selectableProps {
  t: (key: string, options?: Record<string, unknown>) => string
  showSelectionBar: () => void
}

export const selectable = ({
  t,
  showSelectionBar
}: selectableProps): Action => {
  const label = t('toolbar.menu_select')
  const icon = CheckSquareIcon

  return {
    name: 'selectable',
    label,
    icon,
    action: (): void => {
      showSelectionBar()
    },
    Component: forwardRef(function Selectable(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ActionsMenuItem>
      )
    })
  }
}
