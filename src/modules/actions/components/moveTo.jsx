import React, { forwardRef } from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import MovetoIcon from 'cozy-ui/transpiled/react/Icons/Moveto'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { navigateToModalWithMultipleFile } from 'modules/actions/helpers'

const moveTo = ({ t, canMove, pathname, navigate }) => {
  const label = t('SelectionBar.moveto')
  const icon = MovetoIcon

  return {
    name: 'moveTo',
    label,
    icon,
    displayCondition: docs => docs.length > 0 && canMove,
    action: files => {
      navigateToModalWithMultipleFile({
        files,
        pathname,
        navigate,
        path: 'move'
      })
    },
    Component: forwardRef(function MoveTo(props, ref) {
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

export { moveTo }
