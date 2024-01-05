import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { waitForElementToBeRemoved } from '@testing-library/dom'
import { createMockClient } from 'cozy-client'
import { ModalContextProvider, ModalStack } from 'lib/ModalContext'

import AppLike from 'test/components/AppLike'
import { Toolbar } from './Toolbar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/providers/Breakpoints'),
  __esModule: true,
  default: jest.fn(),
  useBreakpoints: jest.fn()
}))

describe('Toolbar', () => {
  const client = createMockClient({})
  client.collection = jest.fn(() => client)
  client.emptyTrash = jest.fn()

  it('asks for confirmation before emptying the trash', async () => {
    // TODO: Warning: You called act(async () => ...) without await. This could lead to unexpected testing behaviour,
    //  interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);
    // However the above resolution makes test failing
    jest.spyOn(console, 'error').mockImplementation()
    useBreakpoints.mockReturnValue({ isMobile: false })

    const { getByText } = render(
      <AppLike client={client}>
        <ModalContextProvider>
          <ModalStack />
          <Toolbar disabled={false} emptyTrash={jest.fn()} />
        </ModalContextProvider>
      </AppLike>
    )

    const emptyTrashButton = getByText('Empty trash')
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
