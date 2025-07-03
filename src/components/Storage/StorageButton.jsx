import cx from 'classnames'
import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import {
  shouldDisplayOffers,
  buildPremiumLink
} from 'cozy-client/dist/models/instance'
import { isFlagshipApp } from 'cozy-device-helper'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import TwakeWorkplaceIcon from 'cozy-ui/transpiled/react/Icons/TwakeWorkplace'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const StorageButton = ({ className }) => {
  const { t } = useI18n()
  const instanceInfo = useInstanceInfo()
  const { isMobile } = useBreakpoints()

  if (!instanceInfo.isLoaded || isFlagshipApp() || isMobile) return null

  if (!shouldDisplayOffers(instanceInfo)) return null

  return (
    <Button
      className={cx('u-bdrs-4', className)}
      variant="secondary"
      label={t('Storage.increase')}
      startIcon={<Icon icon={TwakeWorkplaceIcon} size={22} />}
      size="small"
      height="auto"
      fullWidth
      component="a"
      target="_blank"
      href={buildPremiumLink(instanceInfo)}
    />
  )
}

export default StorageButton
