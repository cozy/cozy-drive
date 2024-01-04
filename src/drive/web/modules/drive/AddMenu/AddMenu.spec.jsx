import React from 'react'
import { render, act } from '@testing-library/react'

import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import { useAppLinkWithStoreFallback } from 'cozy-client'
import { ScannerProvider } from 'drive/web/modules/drive/Toolbar/components/Scanner/ScannerProvider'
import AppLike from 'test/components/AppLike'
import { ActionMenuContent } from './AddMenu'

jest.mock('cozy-client/dist/hooks/useAppLinkWithStoreFallback', () => jest.fn())

mockCozyClientRequestQuery()

const setup = async (
  { folderId = 'directory-foobar0' } = {},
  {
    isDisabled = false,
    canCreateFolder = false,
    canUpload = true,
    hasWriteAccess = true,
    isPublic = false,
    isEncryptedFolder = false
  } = {}
) => {
  const { client, store } = await setupFolderContent({
    folderId
  })

  const displayedFolder = folderId ? { id: folderId } : folderId

  client.stackClient.uri = 'http://cozy.localhost'

  const root = render(
    <AppLike client={client} store={store}>
      <ScannerProvider displayedFolder={displayedFolder}>
        <ActionMenuContent
          isDisabled={isDisabled}
          canCreateFolder={canCreateFolder}
          canUpload={canUpload}
          hasWriteAccess={hasWriteAccess}
          isPublic={isPublic}
          isEncryptedFolder={isEncryptedFolder}
          displayedFolder={displayedFolder}
        />
      </ScannerProvider>
    </AppLike>
  )

  return { root }
}

describe('AddMenu', () => {
  describe('Menu', () => {
    beforeAll(() => {
      useAppLinkWithStoreFallback.mockReturnValue({
        fetchStatus: 'loaded'
      })
    })
    it('does not display createNote on public Page', async () => {
      await act(async () => {
        const { root } = await setup(
          { folderId: 'directory-foobar0' },
          { isPublic: true }
        )
        const { queryByText } = root
        expect(queryByText('Note')).toBeNull()
      })
    })

    it('displays createNote on private Page', async () => {
      await act(async () => {
        const { root } = await setup(
          { folderId: 'directory-foobar0' },
          { isPublic: false }
        )
        const { queryByText } = root
        expect(queryByText('Note')).toBeTruthy()
      })
    })

    it('does not display non-supported items inside an encrypted directory', async () => {
      await act(async () => {
        const { root } = await setup(
          { folderId: 'directory-foobar0' },
          { isEncryptedFolder: true }
        )
        const { queryByText } = root
        expect(queryByText('Note')).toBeNull()
        expect(queryByText('Shortcut')).toBeNull()
        expect(queryByText('Folder')).toBeNull()
        expect(queryByText('Text document')).toBeNull()
        expect(queryByText('Spreadsheet')).toBeNull()
        expect(queryByText('Presentation')).toBeNull()
      })
    })
  })
})
