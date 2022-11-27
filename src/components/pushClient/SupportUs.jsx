import React from 'react'
import get from 'lodash/get'

import { translate } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { ButtonLink } from 'cozy-ui/transpiled/react/Button'

import { withClient } from 'cozy-client'
import { isMobileApp, isFlagshipApp } from 'cozy-device-helper'

import withInstance from 'drive/web/modules/upload/withInstance'

import withDiskUsage from './withDiskUsage'
import styles from './supportUs.styl'
const GB = 1000 * 1000 * 1000
const PREMIUM_QUOTA = 50 * GB

const buildPremiumLink = (uuid, managerUrl) =>
  `${managerUrl}/cozy/instances/${uuid}/premium`

// TODO use cozy-client helpers after https://github.com/cozy/cozy-client/pull/567 merge
const SupportUs = ({ t, client }) => {
  if (isMobileApp() || isFlagshipApp()) return null

  const instanceInfo = withInstance(client)

  const uuid = get(instanceInfo, 'instance.data.attributes.uuid')
  const managerUrl = get(instanceInfo, 'context.data.attributes.manager_url')
  const enable_premium_links = get(
    instanceInfo,
    'context.data.attributes.enable_premium_links'
  )
  const diskUsage = withDiskUsage(client)
  const quota = get(diskUsage, 'data.attributes.quota', false)
  /**
   * enable_prenium_links is set on a context (cozy_default and so on)
   * if quota < 50Gb then, the user is freemium
   * if managerUrl then user is not self hosted
   */
  if (
    enable_premium_links &&
    managerUrl &&
    uuid &&
    quota &&
    parseInt(quota) <= PREMIUM_QUOTA
  )
    return (
      <Stack className={styles['SupportUs__wrapper']} spacing="s">
        <Typography
          variant="caption"
          className={styles['SupportUs__description']}
        >
          {t('Nav.support-us-description')}
        </Typography>
        <ButtonLink
          size="tiny"
          href={buildPremiumLink(uuid, managerUrl)}
          target="_blank"
          label={t('Nav.support-us')}
          className={styles['Supportus__button']}
          theme="secondary"
        />
      </Stack>
    )
  return null
}

export default translate()(withClient(SupportUs))
