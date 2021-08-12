import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { act } from '@testing-library/react'

import { isMobileApp } from 'cozy-device-helper'

import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import { useAppLinkWithStoreFallback } from 'cozy-client'
import ScanWrapper from 'drive/web/modules/drive/Toolbar/components/ScanWrapper'
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
    isPublic = false
  } = {}
) => {
  const { client, store } = await setupFolderContent({
    folderId
  })

  client.stackClient.uri = 'http://cozy.localhost'

  const root = render(
    <AppLike client={client} store={store}>
      <ScanWrapper>
        <ActionMenuContent
          isDisabled={isDisabled}
          canCreateFolder={canCreateFolder}
          canUpload={canUpload}
          hasWriteAccess={hasWriteAccess}
          isPublic={isPublic}
        />
      </ScanWrapper>
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
  })
})
