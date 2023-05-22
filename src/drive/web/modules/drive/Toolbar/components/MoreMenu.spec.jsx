import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import { downloadFiles } from 'drive/web/modules/actions/utils'
import AppLike from 'test/components/AppLike'
import MoreMenu from './MoreMenu'

jest.mock('drive/web/modules/actions/utils', () => ({
  downloadFiles: jest.fn().mockResolvedValue()
}))

mockCozyClientRequestQuery()

describe('MoreMenu', () => {
  const setup = async ({ folderId = 'directory-foobar0' } = {}) => {
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
          displayedFolder={{ id: 'id2' }}
          folderId={'id1'}
        />
      </AppLike>
    )

    const { getByTestId } = result
    fireEvent.click(getByTestId('more-button'))

    return { ...result, store, client }
  }

  describe('DownloadButton', () => {
    it('download files', async () => {
      // TODO: remove it when DeleteItem get props
      jest.spyOn(console, 'error').mockImplementation()
      // TODO : Fix https://github.com/cozy/cozy-drive/issues/2913
      jest.spyOn(console, 'warn').mockImplementation()

      const { getByText } = await setup()

      fireEvent.click(getByText('Download folder'))
      expect(downloadFiles).toHaveBeenCalled()
    })
  })
})
