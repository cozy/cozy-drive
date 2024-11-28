import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { HOME_LINK_HREF } from 'constants/config'
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
  const label =
    link === HOME_LINK_HREF
      ? t('Share.create-cozy')
      : isSharingShortcutCreated
      ? t('toolbar.menu_sync_cozy')
      : t('toolbar.add_to_mine')

  const icon =
    !isSharingShortcutCreated || link === HOME_LINK_HREF
      ? 'to-the-cloud'
      : 'sync'

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
