import React from 'react'
import { ButtonLink } from 'cozy-ui/transpiled/react'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

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
