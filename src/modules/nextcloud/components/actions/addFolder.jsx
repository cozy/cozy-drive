import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import IconFolder from 'cozy-ui/transpiled/react/Icons/FileTypeFolder'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const addFolder = ({ t }) => {
  const label = t('toolbar.menu_new_folder')
  const icon = IconFolder

  return {
    name: 'addFolder',
    label,
    icon,
    action: () => {},
    disabled: () => true,
    Component: forwardRef(function AddFolder(props, ref) {
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

export { addFolder }
