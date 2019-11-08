import styles from './supportus.styl'

import { translate } from 'cozy-ui/react/I18n'

import React from 'react'

import { withClient } from 'cozy-client'
import withInstance from 'drive/web/modules/upload/withInstance'
import withDiskUsage from './withDiskUsage'

import { buildPremiumLink } from 'drive/web/modules/upload/QuotaAlert'
import { isMobileApp } from 'cozy-device-helper'
import get from 'lodash/get'

const Supportus = ({ t, client }) => {
  if (isMobileApp()) return null

  const instanceInfo = withInstance(client)

  const uuid = get(instanceInfo, 'instance.data.attributes.uuid')
  const managerUrl = get(instanceInfo, 'context.data.attributes.manager_url')
  const enable_premium_links = get(
    instanceInfo,
    'context.data.attributes.enable_premium_links'
  )
  const diskUsage = withDiskUsage(client)
  /**
   * enable_prenium_links is set on a context (cozy_default and so on)
   * if quota < 50Gb then, the user is freemium
   * if managerUrl then user is not self hosted
   */
  if (
    enable_premium_links &&
    managerUrl &&
    uuid &&
    diskUsage.data.attributes.quota < 50000000
  )
    return (
      <a
        href={buildPremiumLink(uuid, managerUrl)}
        //eslint-disable-next-line react/jsx-no-target-blank
        target="_blank"
        className={styles['supportus']}
        theme={'secondary'}
      >
        <figure>🎁</figure>
        <span>{t('Nav.support-us')}</span>
      </a>
    )
  return null
}

export default translate()(withClient(Supportus))
