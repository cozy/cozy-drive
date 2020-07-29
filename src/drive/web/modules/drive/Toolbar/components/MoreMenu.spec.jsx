import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import { downloadFiles } from 'drive/web/modules/actions/utils'
import MoreMenu from './MoreMenu'
import AppLike from 'test/components/AppLike'
import { isMobileApp } from 'cozy-device-helper'

// CreateNoteItem uses async hooks which produces act() warning in tests
jest.mock('./CreateNoteItem', () => () => null)

jest.mock('drive/web/modules/actions/utils', () => ({
  downloadFiles: jest.fn().mockResolvedValue()
}))

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isMobileApp: jest.fn().mockReturnValue(false)
}))

mockCozyClientRequestQuery()

describe('MoreMenu', () => {
  const folderId = 'directory-foobar0'

  const setup = async ({ folderId }) => {
    const { client, store } = await setupFolderContent({
      folderId
    })

    client.stackClient.uri = 'http://cozy.tools'

    const result = render(
      <AppLike client={client} store={store}>
        <MoreMenu
          isDisabled={false}
          canCreateFolder={false}
          canUpload
          hasWriteAccess
        />
      </AppLike>
    )

    const { getByTestId } = result
    fireEvent.click(getByTestId('more-button'))

    return { ...result, store, client }
  }

  describe('DownloadButton', () => {
    it('download files', async () => {
      const { getByText } = await setup({ folderId })

      fireEvent.click(getByText('Download folder'))
      expect(downloadFiles).toHaveBeenCalled()
    })
  })

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
      const { getByText, queryByText } = await setup({ folderId })

      // opens the scanner
      fireEvent.click(getByText('Scan a doc'))
      expect(queryByText('Save the doc')).not.toBeNull()

      // closes the scanner and the menu
      fireEvent.click(getByText('Cancel'))
      expect(queryByText('Save the doc')).toBeNull()
      expect(queryByText('Scan a doc')).toBeNull()
    })

    it('is not displayed outsie of a folder', async () => {
      isMobileApp.mockReturnValue(true)
      const { queryByText } = await setup({ folderId: null })

      expect(queryByText('Scan a doc')).toBeNull()
    })

    it('is not displayed on desktop', async () => {
      isMobileApp.mockReturnValue(false)
      const { queryByText } = await setup({ folderId })

      expect(queryByText('Scan a doc')).toBeNull()
    })
  })
})
