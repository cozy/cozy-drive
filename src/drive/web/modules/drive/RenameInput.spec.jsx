import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

import { RenameInput } from './RenameInput'

describe('RenameInput', () => {
  it('test the component', async () => {
    const client = createMockClient({})
    const file = generateFile({ i: '10', type: 'file' })
    const onAbort = jest.fn()
    const { getByText } = render(
      <AppLike client={client}>
        <RenameInput file={{ ...file, meta: { rev: '1' } }} onAbort={onAbort} />
      </AppLike>
    )
    const inputNode = document.getElementsByTagName('input')[0]

    fireEvent.change(inputNode, { target: { value: 'new Name.pdf' } })
    expect(inputNode.value).toBe('new Name.pdf')
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })
    expect(client.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'new Name.pdf'
      })
    )
    await waitFor(() => expect(onAbort).toHaveBeenCalled())

    // Check the Modal to inform that we're changing the file extension
    fireEvent.change(inputNode, { target: { value: 'new Name.txt' } })
    expect(inputNode.value).toBe('new Name.txt')
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })
    await waitFor(() => screen.getByRole('dialog'))

    fireEvent.click(getByText('Continue'))
    expect(client.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'new Name.txt'
      })
    )
    await waitFor(() => expect(onAbort).toHaveBeenCalled())
  })
})
