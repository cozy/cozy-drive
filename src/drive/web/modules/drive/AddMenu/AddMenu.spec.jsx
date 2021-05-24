import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { isMobileApp } from 'cozy-device-helper'

import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'

import ScanWrapper from 'drive/web/modules/drive/Toolbar/components/ScanWrapper'
import AppLike from 'test/components/AppLike'
import { ActionMenuContent } from './AddMenu'

// CreateNoteItem uses async hooks which produces act() warning in tests
jest.mock(
  'drive/web/modules/drive/Toolbar/components/CreateNoteItem',
  () => () => null
)

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn().mockReturnValue(false)
}))

mockCozyClientRequestQuery()

const setup = async ({ folderId = 'directory-foobar0' } = {}) => {
  const { client, store } = await setupFolderContent({
    folderId
  })

  client.stackClient.uri = 'http://cozy.tools'

  const root = render(
    <AppLike client={client} store={store}>
      <ScanWrapper>
        <ActionMenuContent
          isDisabled={false}
          canCreateFolder={false}
          canUpload={true}
          hasWriteAccess={true}
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
    })

    afterAll(() => {
      window.navigator.camera = cameraObject
    })

    it('opens and closes the scanner', async () => {
      isMobileApp.mockReturnValue(true)
      const { root } = await setup()
      const { getByText, queryByText } = root

      // opens the scanner
      fireEvent.click(getByText('Scan a doc'))
      expect(queryByText('Save the doc')).not.toBeNull()

      // closes the scanner
      fireEvent.click(getByText('Cancel'))
      expect(queryByText('Save the doc')).toBeNull()
    })

    it('is not displayed outside of a folder', async () => {
      isMobileApp.mockReturnValue(true)
      const { root } = await setup({ folderId: null })
      const { queryByText } = root

      expect(queryByText('Scan a doc')).toBeNull()
    })

    it('is not displayed on desktop', async () => {
      isMobileApp.mockReturnValue(false)
      const { root } = await setup()
      const { queryByText } = root

      expect(queryByText('Scan a doc')).toBeNull()
    })
  })
})
