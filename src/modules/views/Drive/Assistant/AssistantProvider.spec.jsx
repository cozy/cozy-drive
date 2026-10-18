import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { CozyProvider, createMockClient } from 'cozy-client'
import flag from 'cozy-flags'

import {
  AssistantProvider,
  useAssistant
} from '@/modules/views/Drive/Assistant/AssistantProvider'

jest.mock('cozy-flags')

const ASSISTANTS = [
  {
    _id: 'projects',
    relationships: {
      knowledgeBase: {
        data: [
          { _id: 'projects-dir', _type: 'io.cozy.files' },
          { _type: 'io.cozy.emails' }
        ]
      }
    }
  }
]

const AssistantState = () => {
  const { isAvailable, isKnowledgeBaseFolder, isOpen, open, close } =
    useAssistant()

  return (
    <>
      <output data-testid="state">
        {JSON.stringify({ isAvailable, isKnowledgeBaseFolder, isOpen })}
      </output>
      <button onClick={open}>open</button>
      <button onClick={close}>close</button>
    </>
  )
}

const getState = () => JSON.parse(screen.getByTestId('state').textContent)

const setup = folderId => {
  const client = createMockClient({
    queries: {
      'io.cozy.ai.chat.assistants': {
        doctype: 'io.cozy.ai.chat.assistants',
        definition: { doctype: 'io.cozy.ai.chat.assistants' },
        data: ASSISTANTS
      }
    }
  })

  return render(
    <CozyProvider client={client}>
      <AssistantProvider folderId={folderId}>
        <AssistantState />
      </AssistantProvider>
    </CozyProvider>
  )
}

describe('AssistantProvider', () => {
  beforeEach(() => {
    flag.mockImplementation(name => name === 'cozy.assistant.enabled')
  })

  it('is available, and opens and closes', () => {
    setup('projects-dir')

    expect(getState()).toEqual({
      isAvailable: true,
      isKnowledgeBaseFolder: true,
      isOpen: false
    })

    fireEvent.click(screen.getByText('open'))
    expect(getState().isOpen).toBe(true)

    fireEvent.click(screen.getByText('close'))
    expect(getState().isOpen).toBe(false)
  })

  it('knows a folder no assistant answers from', () => {
    setup('other-dir')

    expect(getState().isKnowledgeBaseFolder).toBe(false)
  })

  it('is not available without the flag', () => {
    flag.mockReturnValue(false)
    setup('projects-dir')

    expect(getState()).toEqual({ isAvailable: false, isOpen: false })
  })

  it('is not available without the provider', () => {
    render(<AssistantState />)

    expect(getState()).toEqual({ isAvailable: false, isOpen: false })
  })
})
