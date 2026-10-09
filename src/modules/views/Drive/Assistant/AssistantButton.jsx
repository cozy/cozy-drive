import { Assistant, Icon } from '@linagora/twake-icons'
import React from 'react'

import IconButton from 'cozy-ui/transpiled/react/IconButton'
import Tooltip from 'cozy-ui/transpiled/react/Tooltip'
import { useI18n } from 'twake-i18n'

import { useAssistant } from '@/modules/views/Drive/Assistant/AssistantProvider'

export const AssistantButton = () => {
  const { t } = useI18n()
  const { isAvailable, isOpen, open, close } = useAssistant()

  // The Drive toolbar is also rendered by views without an AssistantProvider,
  // and the provider gives nothing without the flag
  if (!isAvailable) return null

  const label = t('Assistant.open')

  return (
    <Tooltip title={label}>
      <IconButton
        className="u-mr-half"
        aria-label={label}
        aria-pressed={isOpen}
        onClick={isOpen ? close : open}
      >
        <Icon icon={Assistant} />
      </IconButton>
    </Tooltip>
  )
}
