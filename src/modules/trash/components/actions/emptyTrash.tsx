import React, { forwardRef } from 'react'

import { Action } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

interface emptyTrashProps {
  t: (key: string, options?: Record<string, unknown>) => string
  navigate: (to: string) => void
}

export const emptyTrash = ({ t, navigate }: emptyTrashProps): Action => {
  const label = t('TrashToolbar.emptyTrash')
  const icon = TrashIcon

  return {
    name: 'emptyTrash',
    label,
    icon,
    action: (): void => {
      navigate('empty')
    },
    Component: forwardRef(function EmptyTrash(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText
            primary={label}
            primaryTypographyProps={{ color: 'error' }}
          />
        </ActionsMenuItem>
      )
    })
  }
}
