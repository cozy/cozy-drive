import React from 'react'
import { render, fireEvent, configure } from '@testing-library/react'
import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import { downloadFiles } from 'drive/web/modules/actions/utils'
import MoreMenu from './MoreMenu'
import AppLike from 'test/components/AppLike'

jest.mock('drive/web/modules/actions/utils', () => ({
  downloadFiles: jest.fn().mockResolvedValue()
}))

mockCozyClientRequestQuery()

configure({ testIdAttribute: 'data-test-id' })

describe('MoreMenu', () => {
  const setup = async () => {
    const folderId = 'directory-foobar0'
    const { client, store } = await setupFolderContent({
      folderId
    })

    const result = render(
      <AppLike client={client} store={store}>
        <MoreMenu
          isDisabled={false}
          canCreateFolder={false}
          canUpload={false}
        />
      </AppLike>
    )

    const { getByTestId } = result
    fireEvent.click(getByTestId('more-button'))

    return { ...result, store, client }
  }

  describe('DownloadButton', () => {
    it('should work', async () => {
      const { getByText } = await setup()

      fireEvent.click(getByText('Download folder'))
      expect(downloadFiles).toHaveBeenCalled()
    })
  })
})
