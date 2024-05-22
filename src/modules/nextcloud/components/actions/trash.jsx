import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const trash = ({ t }) => {
  const label = t('SelectionBar.trash')
  const icon = TrashIcon

  return {
    name: 'trash',
    label,
    icon,
    action: () => {},
    disabled: () => true,
    Component: forwardRef(function DeleteNextcloudFile(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} color="var(--errorColor)" />
          </ListItemIcon>
          <ListItemText className="u-error" primary={label} />
        </ActionsMenuItem>
      )
    })
  }
}

export { trash }
