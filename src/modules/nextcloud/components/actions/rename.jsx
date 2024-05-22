import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import RenameIcon from 'cozy-ui/transpiled/react/Icons/Rename'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const rename = ({ t }) => {
  const label = t('SelectionBar.rename')
  const icon = RenameIcon

  return {
    name: 'rename',
    label,
    icon,
    displayCondition: docs => docs.length === 1,
    action: () => {},
    disabled: () => true,
    Component: forwardRef(function Rename(props, ref) {
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

export { rename }
