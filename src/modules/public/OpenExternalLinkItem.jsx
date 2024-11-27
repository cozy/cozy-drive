import PropTypes from 'prop-types'
import React from 'react'

import ActionsMenuItem from 'cozy-ui/transpiled/react/ActionsMenu/ActionsMenuItem'
import Icon from 'cozy-ui/transpiled/react/Icon'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getIconWithlabel } from 'modules/public/OpenExternalLinkButton'
import { openExternalLink } from 'modules/public/helpers'

const OpenExternalLinkItem = ({ link, isSharingShortcutCreated }) => {
  const { t } = useI18n()

  const handleClick = () => {
    openExternalLink(link)
  }

  const { icon, label } = getIconWithlabel({
    link,
    isSharingShortcutCreated,
    t
  })

  return (
    <ActionsMenuItem isListItem onClick={handleClick}>
      <ListItemIcon>
        <Icon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ActionsMenuItem>
  )
}

OpenExternalLinkItem.propTypes = {
  link: PropTypes.string.isRequired,
  isSharingShortcutCreated: PropTypes.bool
}

export default OpenExternalLinkItem
