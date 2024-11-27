import PropTypes from 'prop-types'
import React from 'react'

import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CloudPlusOutlinedIcon from 'cozy-ui/transpiled/react/Icons/CloudPlusOutlined'
import SyncIcon from 'cozy-ui/transpiled/react/Icons/Sync'
import ToTheCloudIcon from 'cozy-ui/transpiled/react/Icons/ToTheCloud'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { HOME_LINK_HREF } from 'constants/config'
import { openExternalLink } from 'modules/public/helpers'

/**
 * Get the icon to display in the button
 * @param {string} link
 * @param {boolean} isSharingShortcutCreated
 * @returns {React.Component}
 */
const getIcon = (link, isSharingShortcutCreated) => {
  if (link === HOME_LINK_HREF) {
    return ToTheCloudIcon
  }
  if (!isSharingShortcutCreated) {
    return CloudPlusOutlinedIcon
  }
  return SyncIcon
}

export const OpenExternalLinkButton = ({ link, isSharingShortcutCreated }) => {
  const { t } = useI18n()

  const handleClick = () => {
    openExternalLink(link)
  }

  const label =
    link === HOME_LINK_HREF
      ? t('Share.create-cozy')
      : isSharingShortcutCreated
      ? t('toolbar.menu_sync_cozy')
      : t('toolbar.add_to_mine')

  const icon = getIcon(link, isSharingShortcutCreated)

  return (
    <Button
      onClick={handleClick}
      startIcon={<Icon icon={icon} />}
      label={label}
    />
  )
}

OpenExternalLinkButton.propTypes = {
  link: PropTypes.string.isRequired,
  isSharingShortcutCreated: PropTypes.bool
}
