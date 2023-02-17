import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { setupStoreAndClient } from 'test/setup'
import AppLike from 'test/components/AppLike'
import usePublicFilesQuery from './usePublicFilesQuery'
import { generateFileFixtures, getByTextWithMarkup } from '../testUtils'
import AppRoute from 'drive/web/modules/navigation/AppRoute'

jest.mock('cozy-client/dist/hooks/useCapabilities', () =>
  jest.fn().mockReturnValue({ capabilities: {} })
)

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))

jest.mock('cozy-intent', () => ({
  WebviewIntentProvider: ({ children }) => children,
  useWebviewIntent: () => ({ call: () => {} })
}))

jest.mock('cozy-flags', () => () => true)
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
  useDisplayedFolder: jest.fn().mockReturnValue({
    dir_id: 'parent-folder-id',
    _id: 'displayed-folder-id',
    name: 'My Folder'
  }),
  useParentFolder: jest.fn().mockReturnValue('5678')
}))

jest.mock('./usePublicFilesQuery', () => {
  return jest.fn()
})
jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))
jest.mock('components/pushClient')

describe('Public View', () => {
  const setup = async () => {
    const { store, client } = setupStoreAndClient()
    client.plugins.realtime = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    }
    client.query = jest.fn().mockReturnValue([])

    const rendered = render(
      <AppLike client={client} store={store}>
        <AppRoute />
      </AppLike>
    )
    return { ...rendered, client }
  }

  const updated_at = '2020-05-14T10:33:31.365224+02:00'

  beforeEach(() => {
    const nbFiles = 2
    const path = '/test'
    const dir_id = 'dirIdParent'
    const filesFixture = generateFileFixtures({
      nbFiles,
      path,
      dir_id,
      updated_at
    })
    usePublicFilesQuery.mockReturnValue({
      data: filesFixture,
      fetchStatus: 'loaded',
      refreshFolderContent: jest.fn()
    })
  })

  it('renders the public view', async () => {
    // TODO : Fix https://github.com/cozy/cozy-drive/issues/2913
    jest.spyOn(console, 'warn').mockImplementation()
    const { getByText } = await setup()

    await act(async () => {
      const sleep = duration =>
        new Promise(resolve => setTimeout(resolve, duration))
      await sleep(100)
    })

    // Get the HTMLElement containing the filename if exist. If not throw
    const el0 = getByText(`foobar0`)
    // Check if the filename is displayed with the extension. If not throw
    getByTextWithMarkup(getByText, `foobar0.pdf`)
    // get the FileRow element
    const fileRow0 = el0.closest('.fil-content-row')
    // check if the date is right
    expect(fileRow0.getElementsByTagName('time')[0].dateTime).toEqual(
      updated_at
    )

    // check if the ActionMenu is displayed
    fireEvent.click(fileRow0.getElementsByTagName('button')[0])
    // navigates  to the history view
    const historyItem = getByText('History')
    fireEvent.click(historyItem)

    expect(mockNavigate).toHaveBeenCalledWith('./file/file-foobar0/revision')
  })

  it('should use FolderViewBreadcrumb with correct rootBreadcrumbPath', async () => {
    // Given
    let render

    // When
    await act(async () => {
      render = await setup()
    })

    // Then
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
