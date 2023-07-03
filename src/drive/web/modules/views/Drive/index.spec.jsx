import React from 'react'
import { act, render } from '@testing-library/react'
import { setupStoreAndClient } from 'test/setup'
import AppLike from 'test/components/AppLike'
import AppRoute from 'drive/web/modules/navigation/AppRoute'

jest.mock('drive/web/modules/views/Drive/useTrashRedirect', () => ({
  useTrashRedirect: jest.fn()
}))

// eslint-disable-next-line react/display-name
jest.mock('../../upload/Dropzone', () => () => <div />)

jest.mock('../Folder/FolderViewBreadcrumb', () =>
  // eslint-disable-next-line react/display-name
  ({ rootBreadcrumbPath, currentFolderId }) => (
    <div
      data-path={rootBreadcrumbPath}
      data-folder-id={currentFolderId}
      data-testid="FolderViewBreadcrumb"
    />
  )
)

jest.mock('drive/hooks', () => ({
  useCurrentFolderId: jest.fn().mockReturnValue('1234'),
  useDisplayedFolder: jest.fn().mockReturnValue('5678')
}))

jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))

jest.mock('components/useHead', () => jest.fn())

describe('Drive View', () => {
  const setup = () => {
    const { store, client } = setupStoreAndClient()
    client.plugins.realtime = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    }
    client.query = jest.fn().mockReturnValue({ data: [] })
    client.fetchQueryAndGetFromState = jest.fn().mockReturnValue({ data: [] })
    const rendered = render(
      <AppLike client={client} store={store}>
        <AppRoute />
      </AppLike>
    )
    return { ...rendered, client }
  }

  it('should use FolderViewBreadcrumb with correct rootBreadcrumbPath', async () => {
    let render

    await act(async () => {
      render = await setup()
    })

    const { getByTestId } = render
    expect(getByTestId('FolderViewBreadcrumb')).toBeTruthy()
    expect(
      getByTestId('FolderViewBreadcrumb').hasAttribute('data-path')
    ).toEqual(true)
    expect(
      getByTestId('FolderViewBreadcrumb').getAttribute('data-folder-id')
    ).toEqual('1234')
  })
})
