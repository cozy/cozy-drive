import React, { forwardRef } from 'react'

import { isFile } from 'cozy-client/dist/models/file'
import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import InfoIcon from 'cozy-ui/transpiled/react/Icons/Info'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const makeComponent = (label, icon, t) => {
  const Component = forwardRef((props, ref) => {
    const { isMobile } = useBreakpoints()
    const actionLabel = isMobile ? t('actions.infosMobile') : t('actions.infos')

    return (
      <ActionsMenuItem {...props} ref={ref}>
        <ListItemIcon>
          <Icon icon={icon} />
        </ListItemIcon>
        <ListItemText primary={actionLabel} />
      </ActionsMenuItem>
    )
  })

  Component.displayName = 'infos'

  return Component
}

export const infos = ({ t, navigate }) => {
  const icon = InfoIcon
  const label = t('actions.infos')

  return {
    name: 'infos',
    icon,
    label,
    displayCondition: docs => docs.length <= 1 && isFile(docs[0]),
    Component: makeComponent(label, icon, t),
    action: docs => {
      navigate(`file/${docs[0]._id}`)
    }
  }
}
