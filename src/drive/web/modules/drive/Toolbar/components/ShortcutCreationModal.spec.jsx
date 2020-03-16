/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { render, fireEvent, cleanup } from '@testing-library/react'
import mediaQuery from 'css-mediaquery'

import { createMockClient } from 'cozy-client'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'

import ShortcutCreationModal from './ShortcutCreationModal'
import AppLike from '../../../../../../../test/components/AppLike'
const tMock = jest.fn()
jest.mock('cozy-ui/transpiled/react/utils/color', () => ({
  getCssVariableValue: () => '#fff'
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
const props = {
  displayedFolder: {
    id: 'id'
  },
  onClose: onCloseSpy,
  open: true
}

describe('ShortcutCreationModal', () => {
  beforeEach(() => {
    window.matchMedia = createMatchMedia(window.innerWidth)
    tMock.mockImplementation(key => key)
  })

  it('should show the new account form', async () => {
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
    fireEvent.change(urlInput, { target: { value: 'https://cozy.io' } })
    fireEvent.click(submitButton)
    expect(client.stackClient.fetchJSON).not.toHaveBeenCalled()
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
  })
})
