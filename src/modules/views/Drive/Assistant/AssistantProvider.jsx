import React, { createContext, useContext, useMemo, useState } from 'react'

import { useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { DOCTYPE_FILES } from '@/lib/doctypes'
import { buildAssistantsQuery } from '@/queries'

const AssistantContext = createContext({ isAvailable: false, isOpen: false })

export const useAssistant = () => useContext(AssistantContext)

const isKnowledgeBaseOf = (assistant, folderId) =>
  (assistant.relationships?.knowledgeBase?.data ?? []).some(
    ref => ref._type === DOCTYPE_FILES && ref._id === folderId
  )

export const AssistantProvider = ({ folderId, children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const assistantsQuery = buildAssistantsQuery()
  const { data: assistants } = useQuery(
    assistantsQuery.definition,
    assistantsQuery.options
  )
  // Offered only in the folders an assistant answers from
  const isKnowledgeBaseFolder = (assistants ?? []).some(assistant =>
    isKnowledgeBaseOf(assistant, folderId)
  )

  const value = useMemo(
    () => ({
      isAvailable: true,
      isKnowledgeBaseFolder,
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false)
    }),
    [isKnowledgeBaseFolder, isOpen]
  )

  // Without the flag, the views keep their layout of before the assistant
  if (!flag('cozy.assistant.enabled')) return children

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  )
}
