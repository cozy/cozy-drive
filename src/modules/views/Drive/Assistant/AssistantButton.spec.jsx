import { render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import AppLike from 'test/components/AppLike'

import { AssistantButton } from '@/modules/views/Drive/Assistant/AssistantButton'
import { useAssistant } from '@/modules/views/Drive/Assistant/AssistantProvider'

jest.mock('@/modules/views/Drive/Assistant/AssistantProvider', () => ({
  useAssistant: jest.fn()
}))

const queryButton = () => screen.queryByRole('button', { name: 'Assistant' })

describe('AssistantButton', () => {
  it('is not shown in a view without the assistant', () => {
    useAssistant.mockReturnValue({ isAvailable: false, isOpen: false })
    render(
      <AppLike client={createMockClient({})}>
        <AssistantButton />
      </AppLike>
    )

    expect(queryButton()).toBe(null)
  })
})
