import React from 'react'
import { ButtonLink } from 'cozy-ui/react'
import CloudIcon from 'drive/assets/icons/icon-cloud-open.svg'

const OpenInCozyButton = ({ t, size = 'normal', href = '' }) => (
  <ButtonLink
    href={href}
    size={size}
    label={t('toolbar.menu_open_cozy')}
    icon={CloudIcon}
  />
)

export default OpenInCozyButton
