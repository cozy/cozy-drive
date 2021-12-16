/* eslint-env jest */
import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import mediaQuery from 'css-mediaquery'

import { createMockClient } from 'cozy-client'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import ShortcutCreationModal from './ShortcutCreationModal'
import AppLike from '../../../../../../../test/components/AppLike'
import useBrowserOffline from 'cozy-ui/transpiled/react/hooks/useBrowserOffline'
import { DOCTYPE_FILES_SHORTCUT } from 'drive/lib/doctypes'

const tMock = jest.fn()

jest.mock('cozy-ui/transpiled/react/hooks/useBrowserOffline')
jest.mock('cozy-ui/transpiled/react/Alerter', () => ({
  error: jest.fn(),
  success: jest.fn()
}))

function createMatchMedia(width) {
  return query => ({
    matches: mediaQuery.match(query, { width }),
    addListener: () => {},
    removeListener: () => {}
  })
}
const client = new createMockClient({})
const onCloseSpy = jest.fn()
const defaultProps = {
  displayedFolder: {
    id: 'id'
  },
  onClose: onCloseSpy,
  open: true
}

describe('ShortcutCreationModal', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    // TODO: cozy-ui  Warning: Failed prop type: The prop `open` is marked as required in `FixedDialog`, but its value is `undefined`.
    // TODO: cozy-ui  Material-UI: You are trying to override a style that does not exist - Fix the `borderWidth` key of `theme.overrides.MuiTextField`
    jest.spyOn(console, 'error').mockImplementation()
    jest.spyOn(console, 'warn').mockImplementation()
    window.matchMedia = createMatchMedia(window.innerWidth)
    tMock.mockImplementation(key => key)
  })

  const setup = props => {
    const { getByLabelText, getByText } = render(
      <AppLike client={client}>
        <MuiCozyTheme>
          <ShortcutCreationModal {...props} />
        </MuiCozyTheme>
      </AppLike>
    )

    const filenameInput = getByLabelText('Filename')
    const submitButton = getByText('Create')

    return {
      urlInput: getByLabelText('URL'),
      filenameInput,
      submitButton
    }
  }

  it('should display error when filename is empty', async () => {
    // Given
    const { urlInput, submitButton } = setup(defaultProps)
    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })

    // When
    fireEvent.click(submitButton)

    // Then
    expect(client.save).not.toHaveBeenCalled()
    expect(Alerter.error).toHaveBeenCalledTimes(1)
    expect(Alerter.success).not.toHaveBeenCalled()
  })

  it('should handle correctly success case', async () => {
    // Given
    const { urlInput, filenameInput, submitButton } = setup(defaultProps)
    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: 'filename.url' } })
    client.save.mockResolvedValue({ data: {} })

    // When
    fireEvent.click(submitButton)

    // Then
    expect(client.save).toHaveBeenCalledWith({
      dir_id: 'id',
      name: 'filename.url',
      _type: DOCTYPE_FILES_SHORTCUT,
      url: 'https://cozy.io'
    })
    await waitFor(() => expect(Alerter.success).toHaveBeenCalledTimes(1))
  })

  it('should call the optional onCreated prop', async () => {
    const onCreatedMock = jest.fn()
    const { urlInput, filenameInput, submitButton } = setup({
      ...defaultProps,
      onCreated: onCreatedMock
    })

    client.save.mockResolvedValue({ data: {} })
    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: 'filename' } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(Alerter.success).toHaveBeenCalledTimes(1))
    expect(onCreatedMock).toHaveBeenCalled()
  })

  it('should alert error on illegal characters', async () => {
    const { urlInput, filenameInput, submitButton } = setup({
      ...defaultProps,
      onCreated: jest.fn()
    })

    client.save.mockRejectedValue({
      message: 'Invalid filename containing illegal character(s): /'
    })

    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: 'file/name' } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith(
      'alert.file_name_illegal_characters',
      {
        fileName: 'file/name',
        characters: '/'
      },
      { duration: 2000 }
    )
  })

  it('should alert error on illegal file name', async () => {
    const { urlInput, filenameInput, submitButton } = setup({
      ...defaultProps,
      onCreated: jest.fn()
    })

    client.save.mockRejectedValue({
      message: 'Invalid filename: ..'
    })

    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: '..' } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('alert.file_name_illegal_name', {
      fileName: '..'
    })
  })

  it('should alert error on missing file name', async () => {
    const { urlInput, filenameInput, submitButton } = setup({
      ...defaultProps,
      onCreated: jest.fn()
    })

    client.save.mockRejectedValue({
      message: 'Missing name argument'
    })

    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: '   ' } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('alert.file_name_missing')
  })

  it('should alert network error when detected by useBrowserOffline', async () => {
    useBrowserOffline.mockReturnValue(true)
    const { urlInput, filenameInput, submitButton } = setup({
      ...defaultProps,
      onCreated: jest.fn()
    })

    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: '   ' } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('alert.offline')
  })

  it('should alert network error when not detected by useBrowserOffline', async () => {
    const { urlInput, filenameInput, submitButton } = setup({
      ...defaultProps,
      onCreated: jest.fn()
    })

    client.save.mockRejectedValue({
      message: 'NetworkError when attempting to fetch resource.'
    })

    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: '   ' } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(Alerter.error).toHaveBeenCalledTimes(1))
    expect(Alerter.error).toHaveBeenCalledWith('upload.alert.network')
  })
})
