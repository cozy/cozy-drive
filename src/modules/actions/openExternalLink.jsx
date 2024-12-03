import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { getIconWithlabel } from 'modules/public/OpenExternalLinkButton'
import { openExternalLink as openExtLink } from 'modules/public/helpers'

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
  Component.displayName = 'OpenExternalLink'

  return Component
}

export const openExternalLink = ({ t, isSharingShortcutCreated, link }) => {
  const { icon, label } = getIconWithlabel({
    link,
    isSharingShortcutCreated,
    t
  })

  return {
    name: 'openExternalLink',
    label,
    icon,
    action: () => {
      openExtLink(link)
    },
    Component: makeComponent(label, icon)
  }
}
