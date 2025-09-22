import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { getFolderIdFromSharing } from '@/modules/shareddrives/helpers'

export const manageAccess = ({ sharedDrive, navigate, t }) => {
  const label = t('toolbar.menu_manage_access')
  const icon = PeopleIcon

  return {
    name: 'manageAccess',
    label: label,
    icon,
    action: () => {
      const folderId = getFolderIdFromSharing(sharedDrive)
      if (folderId) {
        navigate(`folder/${folderId}/share`)
      } else {
        navigate('sharings')
      }
    },
    Component: forwardRef(function ManageAccess(props, ref) {
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
