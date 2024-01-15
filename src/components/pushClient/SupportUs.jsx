import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import {
  shouldDisplayOffers,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'
import { isFlagshipApp } from 'cozy-device-helper'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './supportUs.styl'

const SupportUs = () => {
  const { t } = useI18n()
  const instanceInfo = useInstanceInfo()

  if (!instanceInfo.isLoaded || isFlagshipApp()) return null

  if (shouldDisplayOffers(instanceInfo)) {
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
          href={buildPremiumLink(instanceInfo)}
          target="_blank"
          label={t('Nav.support-us')}
          className={styles['Supportus__button']}
          theme="secondary"
        />
      </Stack>
    )
  }

  return null
}

export default SupportUs
