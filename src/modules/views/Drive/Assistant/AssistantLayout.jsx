import React from 'react'

import styles from './styles.styl'

import { AssistantPanel } from '@/modules/views/Drive/Assistant/AssistantPanel'
import { useAssistant } from '@/modules/views/Drive/Assistant/AssistantProvider'

/**
 * The content of the layout, with the assistant beside it when it is open
 */
export const AssistantLayout = ({ children }) => {
  const { isAvailable } = useAssistant()

  if (!isAvailable) return children

  return (
    <div
      className={`${styles['assistant-layout']} u-flex u-flex-auto u-ov-hidden`}
    >
      {children}
      <AssistantPanel />
    </div>
  )
}
