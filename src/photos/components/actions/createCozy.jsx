import React, { forwardRef } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import ActionMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import CloudIcon from 'cozy-ui/transpiled/react/Icons/Cloud'
import { HOME_LINK_HREF } from 'photos/constants/config'

const createCozy = () => ({
  name: 'createCozy',
  action: () => (window.location = HOME_LINK_HREF),
  Component: forwardRef(function CreateCozy(props, ref) {
    const { t } = useI18n()
    return (
      <ActionMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={CloudIcon} />
        </ListItemIcon>
        <ListItemText primary={t('Share.create-cozy')} />
      </ActionMenuItem>
    )
  })
})

export default createCozy
