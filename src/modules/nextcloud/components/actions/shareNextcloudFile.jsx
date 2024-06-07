import React, { forwardRef } from 'react'

import flag from 'cozy-flags'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import LinkOutIcon from 'cozy-ui/transpiled/react/Icons/LinkOut'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const shareNextcloudFile = ({ t }) => {
  const label = t('toolbar.share')
  const icon = ShareIcon

  return {
    name: 'share',
    label,
    icon,
    displayCondition: docs => docs.length === 1,
    action: docs => {
      window.open(docs[0].links.self, '_blank')
    },
    disabled: () => !flag('drive.show-nextcloud-share-dev'),
    Component: forwardRef(function Share(props, ref) {
      return (
        <ActionsMenuItem {...props} ref={ref}>
          <ListItemIcon>
            <Icon icon={icon} />
          </ListItemIcon>
          <ListItemText primary={label} />
          <ListItemIcon>
            <Icon icon={LinkOutIcon} />
          </ListItemIcon>
        </ActionsMenuItem>
      )
    })
  }
}

export { shareNextcloudFile }
