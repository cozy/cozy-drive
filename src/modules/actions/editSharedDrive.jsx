import React, { forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PeopleIcon from 'cozy-ui/transpiled/react/Icons/People'
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
  Component.displayName = 'EditSharedDrive'

  return Component
}

export const editSharedDrive = ({ t, hasWriteAccess }) => {
  const label = t('SelectionBar.manageAccess')
  const icon = PeopleIcon
  const navigate = useNavigate()

  return {
    name: 'editSharedDrive',
    label,
    icon,
    displayCondition: (selection) => hasWriteAccess && selection.length === 1,
    action: (sharedDrives) => {
      const fileId = sharedDrives[0].rules[0].values[0]
      navigate(`/shareddrive/edit/${sharedDrives[0].id}/${fileId}`)
    },
    Component: makeComponent(label, icon),
  }
}
