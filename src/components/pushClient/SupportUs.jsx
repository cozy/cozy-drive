import React from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import Typography from 'cozy-ui/transpiled/react/Typography'
import Stack from 'cozy-ui/transpiled/react/Stack'
import { ButtonLink } from 'cozy-ui/transpiled/react/deprecated/Button'
import {
  shouldDisplayOffers,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'
import { isMobileApp, isFlagshipApp } from 'cozy-device-helper'

import styles from './supportUs.styl'
import useInstanceInfo from 'hooks/useInstanceInfo'

const SupportUs = () => {
  const { t } = useI18n()
  const instanceInfo = useInstanceInfo()

  if (!instanceInfo.isLoaded || isMobileApp() || isFlagshipApp()) return null

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
