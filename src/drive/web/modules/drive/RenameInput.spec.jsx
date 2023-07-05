import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

import { RenameInput } from './RenameInput'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import useBrowserOffline from 'cozy-ui/transpiled/react/hooks/useBrowserOffline'

jest.mock('cozy-ui/transpiled/react/hooks/useBrowserOffline')
jest.mock('cozy-ui/transpiled/react/Alerter', () => ({
  error: jest.fn(),
  success: jest.fn()
}))

describe('RenameInput', () => {
  let client
  let onAbort
  let file

  beforeEach(() => {
    jest.resetAllMocks()
    client = createMockClient({})
    onAbort = jest.fn()
    file = {
      ...generateFile({ i: '10', type: 'file' }),
      meta: { rev: '1' }
    }
  })

  const setup = ({ file }) => {
    return render(
      <AppLike client={client}>
        <RenameInput file={file} onAbort={onAbort} />
      </AppLike>
    )
  }

  it('tests the component', async () => {
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

  it('should alert error on illegal characters', async () => {
    setup({ file })
    const inputNode = document.getElementsByTagName('input')[0]

    client.save.mockRejectedValueOnce({
      message: 'Invalid filename containing illegal character(s): /'
    })

    fireEvent.change(inputNode, { target: { value: 'new/Name.pdf' } })
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith(
      'alert.file_name_illegal_characters',
      {
        fileName: 'new/Name.pdf',
        characters: '/'
      },
      { duration: 2000 }
    )
  })

  it('should alert error on incorrect file name', async () => {
    setup({ file })
    const inputNode = document.getElementsByTagName('input')[0]

    client.save.mockRejectedValueOnce({
      message: 'Invalid filename: .'
    })

    fireEvent.change(inputNode, { target: { value: '..pdf' } })
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('alert.file_name_illegal_name', {
      fileName: '..pdf'
    })
  })

  it('should alert error on missing file name', async () => {
    setup({ file })
    const inputNode = document.getElementsByTagName('input')[0]

    client.save.mockRejectedValueOnce({
      message: 'Missing name argument'
    })

    fireEvent.change(inputNode, { target: { value: '   .pdf' } })
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('alert.file_name_missing')
  })

  it('should alert network error when detected by useBrowserOffline', async () => {
    useBrowserOffline.mockReturnValue(true)
    setup({ file })
    const inputNode = document.getElementsByTagName('input')[0]

    fireEvent.change(inputNode, { target: { value: '   .pdf' } })
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('alert.offline')
  })

  it('should alert network error when not detected by useBrowserOffline', async () => {
    setup({ file })
    const inputNode = document.getElementsByTagName('input')[0]

    client.save.mockRejectedValueOnce({
      message: 'NetworkError when attempting to fetch resource.'
    })

    fireEvent.change(inputNode, { target: { value: '   .pdf' } })
    fireEvent.keyDown(inputNode, { key: 'Enter', code: 'Enter', keyCode: 13 })

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('upload.alert.network')
  })
})
