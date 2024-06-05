import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import {
  shouldDisplayOffers,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'
import { isFlagshipApp } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Typography from 'cozy-ui/transpiled/react/Typography'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import styles from './supportUs.styl'

const SupportUs = () => {
  const { t } = useI18n()
  const instanceInfo = useInstanceInfo()
  const { isMobile } = useBreakpoints()

  if (!instanceInfo.isLoaded || isFlagshipApp() || isMobile) return null

  if (!shouldDisplayOffers(instanceInfo)) return null

  return (
    <Stack className={styles['SupportUs__wrapper']} spacing="s">
      <Typography
        variant="caption"
        className={styles['SupportUs__description']}
      >
        {t('Nav.support-us-description')}
      </Typography>
      <Button
        size="small"
        component="a"
        href={buildPremiumLink(instanceInfo)}
        target="_blank"
        label={t('Nav.support-us')}
        className={styles['Supportus__button']}
        variant="secondary"
        fullWidth
      />
    </Stack>
  )
}

export default SupportUs
