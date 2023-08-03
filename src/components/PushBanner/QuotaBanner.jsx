import React from 'react'

import CloudSyncIcon from 'cozy-ui/transpiled/react/Icons/CloudSync'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { isMobileApp, isFlagshipApp } from 'cozy-device-helper'
import {
  arePremiumLinksEnabled,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'

import styles from '../pushClient/pushClient.styl'
import useInstanceInfo from 'hooks/useInstanceInfo'
import { usePushBannerContext } from './PushBannerProvider'

/**
 * Banner to inform users that they have reached more than 80% of their disk space
 */
const QuotaBanner = () => {
  const { t } = useI18n()
  const { dismissPushBanner } = usePushBannerContext()
  const instanceInfo = useInstanceInfo()
  const isMobileAppVersion = isMobileApp() || isFlagshipApp()

  const onAction = () => {
    const link = buildPremiumLink(instanceInfo)
    window.open(link, '_self')
  }

  const onDismiss = () => {
    dismissPushBanner('quota')
  }

  return (
    <div className={styles['coz-banner-client']}>
      <Banner
        inline
        icon={<Icon icon={CloudSyncIcon} />}
        bgcolor="var(--defaultBackgroundColor)"
        text={t('PushBanner.quota.text')}
        buttonOne={
          <Button
            label={t('PushBanner.quota.actions.first')}
            variant="text"
            onClick={onDismiss}
          />
        }
        buttonTwo={
          !isMobileAppVersion &&
          arePremiumLinksEnabled(instanceInfo) && (
            <Button
              label={t('PushBanner.quota.actions.second')}
              variant="text"
              onClick={onAction}
            />
          )
        }
      />
    </div>
  )
}

export default QuotaBanner
