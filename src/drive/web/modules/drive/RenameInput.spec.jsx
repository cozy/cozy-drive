import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

import { RenameInput } from './RenameInput'

describe('RenameInput', () => {
  const client = createMockClient({})
  const onAbort = jest.fn()

  const setup = ({ file }) => {
    return render(
      <AppLike client={client}>
        <RenameInput file={file} onAbort={onAbort} />
      </AppLike>
    )
  }

  it('tests the component', async () => {
    const file = {
      ...generateFile({ i: '10', type: 'file' }),
      meta: { rev: '1' }
    }

    const { getByText } = setup({ file })
    const inputNode = document.getElementsByTagName('input')[0]

    fireEvent.change(inputNode, { target: { value: 'new Name.pdf' } })
    expect(inputNode.value).toBe('new Name.pdf')
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })
    expect(client.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'new Name.pdf',
        _rev: '1'
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
        name: 'new Name.txt',
        _rev: '1'
      })
    )
    await waitFor(() => expect(onAbort).toHaveBeenCalled())
  })

  it('works without meta rev', async () => {
    // files that have just been uploaded don't have a meta.rev field, they just have a normal _rev
    const file = {
      ...generateFile({ i: '10', type: 'file' }),
      _rev: 1
    }

    setup({ file })
    const inputNode = document.getElementsByTagName('input')[0]

    fireEvent.change(inputNode, { target: { value: 'new Name.pdf' } })
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })
    expect(client.save).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'new Name.pdf',
        _rev: '1'
      })
    )
  })
})
