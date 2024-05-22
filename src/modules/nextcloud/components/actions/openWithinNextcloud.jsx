import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkOutIcon from 'cozy-ui/transpiled/react/Icons/LinkOut'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

export const openWithinNextcloud = ({ t }) => {
  const label = t('SelectionBar.openWithinNextcloud')
  const icon = LinkOutIcon

  return {
    name: 'openWithinNextcloud',
    label,
    icon,
    displayCondition: docs => docs.length === 1,
    action: docs => {
      window.open(docs[0].links.self, '_blank')
    },
    Component: forwardRef(function OpenWithinNextcloud(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon></ListItemIcon>
          <ListItemText primary={label} />
          <ListItemIcon>
            <Icon icon={LinkOutIcon} />
          </ListItemIcon>
        </ActionsMenuItem>
      )
    })
  }
}
