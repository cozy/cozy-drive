import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'

import { isMobileApp } from 'cozy-device-helper'

import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import { useAppLinkWithStoreFallback } from 'cozy-client'
import { ScannerProvider } from 'drive/Toolbar/components/Scanner/ScannerProvider'
import AppLike from 'test/components/AppLike'
import { ActionMenuContent } from './AddMenu'

jest.mock('cozy-client/dist/hooks/useAppLinkWithStoreFallback', () => jest.fn())

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn().mockReturnValue(false)
}))

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
  describe('Scanner', () => {
    let cameraObject

    beforeAll(() => {
      cameraObject = window.navigator.camera
      window.navigator.camera = {
        DestinationType: {},
        PictureSourceType: {},
        getPicture: jest.fn(onSuccess => {
          onSuccess('/fake/file')
        }),
        cleanup: jest.fn()
      }
      useAppLinkWithStoreFallback.mockReturnValue({
        fetchStatus: 'loaded'
      })
    })

    afterAll(() => {
      window.navigator.camera = cameraObject
    })

    it('opens and closes the scanner', async () => {
      // TODO: Deprecation: `background` is deprecated and has been migrated automatically, you should use `backgroundIcon` now
      // TODO: Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in %s.%s a useEffect cleanup function
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      isMobileApp.mockReturnValue(true)
      await act(async () => {
        const { root } = await setup()
        const { getByText, queryByText } = root

        // opens the scanner
        fireEvent.click(getByText('Scan a doc'))
        expect(queryByText('Save the doc')).not.toBeNull()

        // closes the scanner
        fireEvent.click(getByText('Cancel'))
        expect(queryByText('Save the doc')).toBeNull()
      })
      consoleWarnSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })

    it('is not displayed outside of a folder', async () => {
      isMobileApp.mockReturnValue(true)
      await act(async () => {
        const { root } = await setup({ folderId: null })
        const { queryByText } = root

        expect(queryByText('Scan a doc')).toBeNull()
      })
    })

    it('is not displayed on desktop', async () => {
      isMobileApp.mockReturnValue(false)
      await act(async () => {
        const { root } = await setup()
        const { queryByText } = root

        expect(queryByText('Scan a doc')).toBeNull()
      })
    })
  })

  describe('Menu', () => {
    beforeAll(() => {
      useAppLinkWithStoreFallback.mockReturnValue({
        fetchStatus: 'loaded'
      })
    })
    it('does not display createNote on public Page', async () => {
      isMobileApp.mockReturnValue(true)

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
      isMobileApp.mockReturnValue(true)

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
      isMobileApp.mockReturnValue(false)

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
