import React, { forwardRef } from 'react'

import flag from 'cozy-flags'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import MovetoIcon from 'cozy-ui/transpiled/react/Icons/Moveto'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { navigateToModalWithMultipleFile } from 'modules/actions/helpers'

const moveNextcloud = ({ t, pathname, navigate, search }) => {
  const label = t('SelectionBar.moveto')
  const icon = MovetoIcon

  return {
    name: 'moveNextcloud',
    label,
    icon,
    displayCondition: docs => docs.length > 0,
    action: files => {
      navigateToModalWithMultipleFile({
        files,
        pathname,
        navigate,
        path: 'move',
        search
      })
    },
    disabled: docs =>
      docs.some(doc => doc.type === 'directory') ||
      !flag('drive.show-nextcloud-move-dev'),
    Component: forwardRef(function MoveNextcloud(props, ref) {
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

export { moveNextcloud }
