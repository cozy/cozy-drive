import React from 'react'
import { shallow } from 'enzyme'
import { DumbFolderView } from './LightFolderView'

describe('LightFolderView', () => {
  it('changes the URL when navigating to a new folder', async () => {
    const fetchFolderMock = jest.fn().mockResolvedValue([])
    const router = {
      push: jest.fn()
    }
    const currentFolderId = '123'

    const comp = shallow(
      <DumbFolderView
        location={{ pathname: '/folder' }}
        params={{
          folderId: currentFolderId
        }}
        router={router}
        displayedFolder={currentFolderId}
        openedFolderId={currentFolderId}
        fileCount={0}
        files={[]}
        fetchFolder={fetchFolderMock}
      />
    )

    await comp.instance().navigateToFolder('456')
    expect(router.push).toHaveBeenCalledWith('/folder/456')
  })
})
