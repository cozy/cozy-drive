import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import { downloadFiles } from 'drive/web/modules/actions/utils'
import MoreMenu from 'drive/web/modules/drive/Toolbar/components/MoreMenu'
import AppLike from 'test/components/AppLike'
import { MoreButton } from 'components/Button'

jest.mock('drive/web/modules/actions/utils', () => ({
  downloadFiles: jest.fn().mockResolvedValue()
}))

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

mockCozyClientRequestQuery()

describe('MoreMenu', () => {
  const setup = async () => {
    const folderId = 'directory-foobar0'
    const { client, store } = await setupFolderContent({
      folderId
    })

    const root = mount(
      <AppLike client={client} store={store}>
        <MoreMenu
          isDisabled={false}
          canCreateFolder={false}
          canUpload={false}
        />
      </AppLike>
    )

    await sleep(1)

    // Open the menu
    act(() => {
      root
        .find(MoreButton)
        .props()
        .onClick()
    })
    root.update()

    return { root, store, client }
  }

  describe('DownloadButton', () => {
    it('should work', async () => {
      const { root } = await setup()

      const actionMenuItem = root.findWhere(node => {
        return (
          node.type() === ActionMenuItem && node.text() == 'Download folder'
        )
      })
      actionMenuItem.props().onClick()
      await sleep(0)
      expect(downloadFiles).toHaveBeenCalled()
    })
  })
})
