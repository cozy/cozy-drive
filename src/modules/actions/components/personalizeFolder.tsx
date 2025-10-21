import React, { forwardRef } from 'react'

import { Action } from 'cozy-ui/transpiled/react/ActionsMenu/Actions'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import PaletteIcon from 'cozy-ui/transpiled/react/Icons/Palette'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

interface personalizeFolderProps {
  t: (key: string, options?: Record<string, unknown>) => string
  navigate: (path: string) => void
}

const personalizeFolder = ({ t, navigate }: personalizeFolderProps): Action => {
  const icon = PaletteIcon
  const label = t('actions.personalizeFolder.label')

  return {
    name: 'personalizeFolder',
    label,
    icon,
    displayCondition: docs =>
      docs.length === 1 && docs.every(doc => doc.type === 'directory'),
    action: async (files): Promise<void> => {
      navigate(`personalize`)
    },
    Component: forwardRef(function personalizeFolder(props, ref) {
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

export { personalizeFolder }
