import React, { createContext, useContext, useMemo, useState } from 'react'

import flag from 'cozy-flags'

const AssistantContext = createContext({ isAvailable: false, isOpen: false })

export const useAssistant = () => useContext(AssistantContext)

export const AssistantProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)

  const value = useMemo(
    () => ({
      isAvailable: true,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false)
    }),
    [isOpen]
  )

  // Without the flag, the views keep their layout of before the assistant
  if (!flag('cozy.assistant.enabled')) return children

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  )
}
