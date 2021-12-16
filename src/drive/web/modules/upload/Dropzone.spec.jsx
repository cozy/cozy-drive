import React from 'react'
import { mount } from 'enzyme'
import { setupFolderContent, mockCozyClientRequestQuery } from 'test/setup'
import Dropzone, { Dropzone as DumbDropzone } from './Dropzone'
import AppLike from 'test/components/AppLike'
import { uploadFiles } from 'drive/web/modules/navigation/duck'

jest.mock('drive/web/modules/navigation/duck', () => ({
  uploadFiles: jest.fn().mockReturnValue({
    type: 'FAKE_UPLOAD_FILES'
  })
}))

mockCozyClientRequestQuery()

describe('Dropzone', () => {
  it('should dispatch the uploadFiles action', async () => {
    const displayedFolder = {
      id: 'directory-foobar0'
    }
    const { store, client } = await setupFolderContent({
      folderId: 'directory-foobar0'
    })

    store.dispatch = jest.fn()

    const root = mount(
      <AppLike client={client} store={store}>
        <Dropzone displayedFolder={displayedFolder} />
      </AppLike>
    )

    const dropzone = root.find(DumbDropzone)
    const files = []
    dropzone.props().uploadFiles(files)
    expect(uploadFiles).toHaveBeenCalledWith(
      files,
      'directory-foobar0',
      expect.objectContaining({
        refresh: expect.any(Function)
      })
    )
  })
})
