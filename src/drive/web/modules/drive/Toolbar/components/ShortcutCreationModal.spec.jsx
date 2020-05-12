/* eslint-env jest */
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import mediaQuery from 'css-mediaquery'

import { createMockClient } from 'cozy-client'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import Alerter from 'cozy-ui/transpiled/react/Alerter'

import ShortcutCreationModal from './ShortcutCreationModal'
import AppLike from '../../../../../../../test/components/AppLike'
const tMock = jest.fn()

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

    const urlInput = getByLabelText('URL')
    const filenameInput = getByLabelText('Filename')
    const submitButton = getByText('Create')

    return {
      urlInput,
      filenameInput,
      submitButton
    }
  }

  it('should show the new shortcut form', async () => {
    const { urlInput, filenameInput, submitButton } = setup(defaultProps)
    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })

    fireEvent.click(submitButton)
    expect(client.stackClient.fetchJSON).not.toHaveBeenCalled()
    expect(Alerter.error).toHaveBeenCalledTimes(1)
    expect(Alerter.success).not.toHaveBeenCalled()

    client.stackClient.fetchJSON.mockResolvedValue({ data: {} })
    fireEvent.change(filenameInput, { target: { value: 'filename' } })
    fireEvent.click(submitButton)

    expect(client.stackClient.fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/shortcuts',
      {
        data: {
          attributes: {
            dir_id: 'id',
            name: 'filename.url',
            type: 'io.cozy.files.shortcuts',
            url: 'https://cozy.io'
          },
          type: 'io.cozy.files.shortcuts'
        }
      }
    )
    expect(Alerter.error).toHaveBeenCalledTimes(1)
    await waitFor(() => expect(Alerter.success).toHaveBeenCalledTimes(1))

    fireEvent.change(filenameInput, { target: { value: 'filename.url' } })
    fireEvent.click(submitButton)
    expect(client.stackClient.fetchJSON).toHaveBeenCalledWith(
      'POST',
      '/shortcuts',
      {
        data: {
          attributes: {
            dir_id: 'id',
            name: 'filename.url',
            type: 'io.cozy.files.shortcuts',
            url: 'https://cozy.io'
          },
          type: 'io.cozy.files.shortcuts'
        }
      }
    )
    await waitFor(() => expect(Alerter.success).toHaveBeenCalledTimes(2))
  })

  it('should call the optional onCreated prop', async () => {
    const onCreatedMock = jest.fn()
    const { urlInput, filenameInput, submitButton } = setup({
      ...defaultProps,
      onCreated: onCreatedMock
    })

    client.stackClient.fetchJSON.mockResolvedValue({ data: {} })
    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.change(filenameInput, { target: { value: 'filename' } })
    fireEvent.click(submitButton)

    await waitFor(() => expect(Alerter.success).toHaveBeenCalledTimes(1))
    expect(onCreatedMock).toHaveBeenCalled()
  })
})
