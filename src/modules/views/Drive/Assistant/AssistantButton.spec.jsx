import { render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import AppLike from 'test/components/AppLike'

import { AssistantButton } from '@/modules/views/Drive/Assistant/AssistantButton'

describe('AssistantButton', () => {
  it('is not shown in a view without the assistant', () => {
    render(
      <AppLike client={createMockClient({})}>
        <AssistantButton isAvailable={false} isOpen={false} />
      </AppLike>
    )

    expect(screen.queryByRole('button', { name: 'Assistant' })).toBe(null)
  })

  it('is shown in a folder an assistant answers from only', () => {
    const { rerender } = render(
      <AppLike client={createMockClient({})}>
        <AssistantButton isAvailable isKnowledgeBaseFolder={false} />
      </AppLike>
    )

    expect(screen.queryByRole('button', { name: 'Assistant' })).toBe(null)

    rerender(
      <AppLike client={createMockClient({})}>
        <AssistantButton isAvailable isKnowledgeBaseFolder />
      </AppLike>
    )

    expect(
      screen.getByRole('button', { name: 'Assistant' })
    ).toBeInTheDocument()
  })
})
