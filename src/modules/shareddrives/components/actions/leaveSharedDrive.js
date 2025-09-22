import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TrashIcon from 'cozy-ui/transpiled/react/Icons/Trash'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

export const leaveSharedDrive = ({ sharedDrive, client, showAlert, t }) => {
  const label = t('toolbar.menu_leave_shared_drive')
  const icon = TrashIcon

  return {
    name: 'leaveSharedDrive',
    label: label,
    icon,
    displayCondition: () => !sharedDrive.owner,
    action: async () => {
      await client
        .collection('io.cozy.sharings')
        .revokeSelf({ _id: sharedDrive.id })

      showAlert({
        message: t('Files.share.revokeSelf.success'),
        severity: 'success'
      })
    },
    Component: forwardRef(function deleteSharedDrive(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} className="u-error" />
          </ListItemIcon>
          <ListItemText primary={label} />
        </ActionsMenuItem>
      )
    })
  }
}
