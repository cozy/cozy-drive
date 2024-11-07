import { render } from '@testing-library/react'
import React from 'react'

import { FileOpener } from './FileOpenerExternal'
import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'

global.cozy = {
  client: {
    files: {
      statById: jest.fn()
    }
  }
}

const routerMock = {
  push: () => {},
  params: {
    fileId: '1'
  }
}
const showAlert = jest.fn()
const t = x => x

jest.mock('cozy-keys-lib', () => ({
  withVaultClient: jest.fn().mockImplementation(arg => arg),
  useVaultClient: jest.fn()
}))

describe('FileOpenerExternal', () => {
  it('should set the id in state', async () => {
    const { client, store } = setupStoreAndClient({})

    global.cozy.client.files.statById.mockResolvedValue({
      _id: '123',
      name: 'file.txt',
      attributes: {}
    })

    const container = render(
      <AppLike client={client} store={store}>
        <FileOpener
          router={routerMock}
          fileId="123"
          routeParams={{
            fileId: '123'
          }}
          showAlert={showAlert}
          t={t}
          breakpoints={{
            isDesktop: true
          }}
        />
      </AppLike>
    )

    await container.findByText('file.txt')
  })

  it('should set the id in state even after a props update', async () => {
    const { client, store } = setupStoreAndClient({})

    global.cozy.client.files.statById.mockResolvedValue({
      _id: '123',
      name: 'file123.txt',
      attributes: {}
    })

    const container = render(
      <AppLike client={client} store={store}>
        <FileOpener
          router={routerMock}
          fileId="123"
          routeParams={{
            fileId: '123'
          }}
          showAlert={showAlert}
          t={t}
          breakpoints={{
            isDesktop: true
          }}
        />
      </AppLike>
    )

    await container.findByText('file123.txt')

    global.cozy.client.files.statById.mockResolvedValue({
      _id: '456',
      name: 'file456.txt',
      attributes: {}
    })

    container.rerender(
      <AppLike client={client} store={store}>
        <FileOpener
          router={routerMock}
          fileId="456"
          routeParams={{
            fileId: '456'
          }}
          showAlert={showAlert}
          t={t}
          breakpoints={{
            isDesktop: true
          }}
        />
      </AppLike>
    )

    await container.findByText('file456.txt')
  })
})
