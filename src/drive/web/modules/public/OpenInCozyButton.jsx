import React from 'react'
import { ButtonLink } from 'cozy-ui/react'

const OpenInCozyButton = ({ t, size = 'normal', href = '' }) => (
  <ButtonLink
    href={href}
    size={size}
    label={t('toolbar.menu_open_cozy')}
    icon={'to-the-cloud'}
  />
)

export default OpenInCozyButton
