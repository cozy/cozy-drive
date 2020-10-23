import React from 'react'
import { ButtonLink, useI18n } from 'cozy-ui/transpiled/react'

const OpenInCozyButton = ({ size = 'normal', href = '' }) => {
  const { t } = useI18n()
  return (
    <ButtonLink
      href={href}
      size={size}
      label={t('toolbar.menu_open_cozy')}
      icon={'to-the-cloud'}
    />
  )
}

export default OpenInCozyButton
