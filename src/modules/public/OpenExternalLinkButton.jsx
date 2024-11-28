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
export const getLabel = (link, isSharingShortcutCreated) => {
  if (link === HOME_LINK_HREF) {
    return ToTheCloudIcon
  }
  if (!isSharingShortcutCreated) {
    return CloudPlusOutlinedIcon
  }
  return SyncIcon
}

/**
 * Get the icon and label to display in the button
 * @param {object} params
 * @param {string} params.link
 * @param {boolean} params.isSharingShortcutCreated
 * @param {object} params.t
 * @returns {{ icon: React.Component, label: string }}
 */
export const getIconWithlabel = ({ link, isSharingShortcutCreated, t }) => {
  if (link === HOME_LINK_HREF) {
    return { icon: ToTheCloudIcon, label: t('Share.create-cozy') }
  }
  if (!isSharingShortcutCreated) {
    return { icon: CloudPlusOutlinedIcon, label: t('toolbar.add_to_mine') }
  }
  return { icon: SyncIcon, label: t('toolbar.menu_sync_cozy') }
}

export const OpenExternalLinkButton = ({
  link,
  isSharingShortcutCreated,
  ...props
}) => {
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
    <Button
      onClick={handleClick}
      startIcon={<Icon icon={icon} />}
      label={label}
      {...props}
    />
  )
}

OpenExternalLinkButton.propTypes = {
  link: PropTypes.string.isRequired,
  isSharingShortcutCreated: PropTypes.bool
}
