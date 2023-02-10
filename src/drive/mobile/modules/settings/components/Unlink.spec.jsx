import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { createMockClient } from 'cozy-client'
import AppLike from 'test/components/AppLike'
import { Unlink } from './Unlink'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

describe('Unlink', () => {
  it('should call the unlink function', () => {
    const unlink = jest.fn()
    const client = createMockClient({})
    const clientSettings = {
      data: 'foo'
    }
    const { getByText } = render(
      <AppLike client={client}>
        <Unlink unlink={unlink} clientSettings={clientSettings} />
      </AppLike>
    )

    const unlinkButton = getByText('Sign out')
    fireEvent.click(unlinkButton)

    expect(unlink).toHaveBeenCalledWith(client, clientSettings, mockNavigate)
  })
})
