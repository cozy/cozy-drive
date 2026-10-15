import { act, render, screen } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import { TrashFolderView } from './TrashFolderView'
import AppLike from 'test/components/AppLike'
import { setupStoreAndClient } from 'test/setup'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(() => null)
}))

import { useCurrentFolderId, useDisplayedFolder, useFolderSort } from '@/hooks'

jest.mock('@/hooks', () => ({
  useCurrentFolderId: jest.fn(() => 'io.cozy.files.trash-dir'),
  useDisplayedFolder: jest.fn(() => ({
    displayedFolder: { _id: 'trash' },
    isNotFound: false
  })),
  useFolderSort: jest.fn(() => [
    { attribute: 'updated_at', order: 'desc' },
    jest.fn()
  ])
}))

jest.mock('@/components/useHead', () => jest.fn())
jest.mock('../Folder/FolderViewBody', () => () => (
  <div data-testid="trash-content" />
))
jest.mock('../Folder/virtualized/FolderViewBody', () => () => (
  <div data-testid="trash-content" />
))
jest.mock('@/modules/trash/components/TrashBreadcrumb', () => ({
  TrashBreadcrumb: () => null
}))
jest.mock('@/modules/trash/components/TrashToolbar', () => ({
  TrashToolbar: () => null
}))

const client = createMockClient({})
client.query = jest.fn().mockReturnValue({ data: [] })

function TestComponent({ onResult }) {
  const currentFolderId = useCurrentFolderId()
  const [sortOrder] = useFolderSort(currentFolderId)

  React.useEffect(() => {
    onResult({ currentFolderId, sortOrder })
  }, [currentFolderId, sortOrder, onResult])

  return null
}

describe('TrashFolderView', () => {
  it('uses the updated_at sort for trash folder by default', () => {
    let result = null

    const handleResult = data => {
      result = data
    }

    render(
      <AppLike client={client}>
        <TestComponent onResult={handleResult} />
      </AppLike>
    )

    expect(result.currentFolderId).toBe('io.cozy.files.trash-dir')
    expect(result.sortOrder.attribute).toBe('updated_at')
    expect(result.sortOrder.order).toBe('desc')
  })
})

describe('TrashFolderView redirection', () => {
  const setup = async displayedFolder => {
    useDisplayedFolder.mockReturnValue({ displayedFolder, isNotFound: false })
    window.location.hash = `#/trash/${displayedFolder.id}`
    const { store, client } = setupStoreAndClient()
    client.plugins.realtime = { subscribe: jest.fn(), unsubscribe: jest.fn() }
    client.query = jest.fn().mockReturnValue({ data: [] })
    await act(async () => {
      render(
        <AppLike client={client} store={store}>
          <TrashFolderView />
        </AppLike>
      )
    })
  }

  it('opens a folder that is not in the trash in the drive instead', async () => {
    await setup({ id: 'live-id', path: '/Projects' })

    expect(window.location.hash).toBe('#/folder/live-id')
    expect(screen.queryByTestId('trash-content')).toBe(null)
  })

  it('keeps a trashed folder in the trash', async () => {
    await setup({ id: 'trashed-id', path: '/.cozy_trash/Projects' })

    expect(window.location.hash).toBe('#/trash/trashed-id')
    expect(screen.getByTestId('trash-content')).toBeInTheDocument()
  })
})
