import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { waitForElementToBeRemoved } from '@testing-library/dom'
import { createMockClient } from 'cozy-client'
import { ModalContextProvider, ModalStack } from 'drive/lib/ModalContext'

import AppLike from 'test/components/AppLike'
import { Toolbar } from './Toolbar'

describe('Toolbar', () => {
  const client = createMockClient({})
  client.collection = jest.fn(() => client)
  client.emptyTrash = jest.fn()

  it('asks for confirmation before emptying the trash', async () => {
    const { getByText } = render(
      <AppLike client={client}>
        <ModalContextProvider>
          <ModalStack />
          <Toolbar
            t={jest.fn(x => x)}
            disabled={false}
            selectionModeActive={false}
            emptyTrash={jest.fn()}
            breakpoints={{ isMobile: false }}
          />
        </ModalContextProvider>
      </AppLike>
    )

    const emptyTrashButton = getByText('toolbar.empty_trash')
    act(() => {
      fireEvent.click(emptyTrashButton)
    })

    const confirmButton = getByText('Delete all')
    act(async () => {
      await fireEvent.click(confirmButton)
    })

    expect(client.emptyTrash).toHaveBeenCalled()
    await waitForElementToBeRemoved(() => getByText('Delete all'))
  })
})
