import { render, screen } from '@testing-library/react'
import { useCurrentFolderId } from 'hooks'
import React from 'react'

import { createMockClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'

import { TrashFolderView } from './TrashFolderView'
import { generateFileFixtures } from '../testUtils'
import { TRASH_DIR_ID } from 'constants/config'
import AppLike from 'test/components/AppLike'
import { setupStore } from 'test/setup'

jest.mock('components/pushClient')
jest.mock('components/useHead', () => jest.fn())
jest.mock('cozy-sharing', () => ({
  ...jest.requireActual('cozy-sharing'),
  useSharingContext: jest.fn()
}))
jest.mock('hooks', () => ({
  useCurrentFolderId: jest.fn(),
  useDisplayedFolder: jest.fn().mockReturnValue({
    isNotFound: false,
    displayedFolder: {
      _id: 'io.cozy.trash'
    }
  })
}))
jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))

useSharingContext.mockReturnValue({ byDocId: [] })

describe('TrashFolderView', () => {
  const setup = ({ currentFolderId = TRASH_DIR_ID, isEmpty = false } = {}) => {
    const nbFiles = 1
    const path = '/trash'
    const dir_id = 'io.cozy.files.trash-dir'
    const updated_at = '2020-05-14T10:33:31.365224+02:00'
    const filesFixture = generateFileFixtures({
      nbFiles,
      path,
      dir_id,
      updated_at
    })
    const foldersFixture = generateFileFixtures({
      nbFiles,
      path,
      dir_id,
      updated_at,
      type: 'directory',
      prefix: 'folder'
    })

    const mockClient = createMockClient({
      queries: {
        'trash-directory io.cozy.files.trash-dir name asc': {
          doctype: 'io.cozy.files',
          definition: {
            doctype: 'io.cozy.files',
            selector: {
              type: 'directory'
            }
          },
          data: isEmpty ? [] : foldersFixture
        },
        'trash-file io.cozy.files.trash-dir name asc': {
          doctype: 'io.cozy.files',
          data: isEmpty ? [] : filesFixture
        }
      }
    })

    mockClient.plugins.realtime = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    }

    const store = setupStore({ client: mockClient, setStoreToClient: false })

    useCurrentFolderId.mockReturnValue(currentFolderId)

    return render(
      <AppLike client={mockClient} store={store}>
        <TrashFolderView />
      </AppLike>
    )
  }

  it('renders the Trash view', async () => {
    setup()

    const folder = await screen.findByText('folder0')
    expect(folder).toBeInTheDocument()

    const file = await screen.findByTitle('foobar0.pdf')
    expect(file).toBeInTheDocument()
  })

  it('renders the empty trash view', async () => {
    setup({ isEmpty: true })

    const empty = await screen.findByText(`You don’t have any deleted files.`)
    expect(empty).toBeInTheDocument()
  })

  it('should contain breadcrumb with root path', async () => {
    setup()

    const title = await screen.findByText('Trash')
    expect(title).toBeInTheDocument()
  })
})
