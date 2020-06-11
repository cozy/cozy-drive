import React from 'react'
import { mount } from 'enzyme'
import { Overlay, Viewer } from 'cozy-ui/transpiled/react'
import FilesViewer from './FilesViewerV2'
import CozyClient, { useQuery } from 'cozy-client'
import AppLike from 'test/components/AppLike'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const filesFixture = [
  {
    dir_id: 'io.cozy.files.root-dir',
    displayedPath: '/',
    id: 'foobar',
    name: 'foobar.pdf',
    path: '/foobar.pdf',
    type: 'file'
  },
  {
    dir_id: 'io.cozy.files.root-dir',
    displayedPath: '/',
    id: 'foobar2',
    name: 'foobar2.pdf',
    path: '/foobar2.pdf',
    type: 'file'
  },
  {
    dir_id: 'io.cozy.files.root-dir',
    displayedPath: '/',
    id: 'foobar3',
    name: 'foobar3.pdf',
    path: '/foobar3.pdf',
    type: 'file'
  }
]

describe('FilesViewer', () => {
  const setup = () => {
    const client = new CozyClient({})
    const store = {
      subscribe: () => {},
      getState: () => ({
        router: {
          params: {
            fileId: 'foobar',
            folderId: 'folder-id'
          }
        }
      })
    }
    const root = mount(
      <AppLike client={client} store={store}>
        <FilesViewer client={client} fileId="foobar" files={filesFixture} />
      </AppLike>
    )
    return {
      root
    }
  }

  it('should render a Viewer', () => {
    useQuery.mockReturnValue({
      data: filesFixture,
      count: filesFixture.length,
      fetchMore: jest.fn().mockImplementation(() => {
        throw new Error('Fetch more should not be called')
      })
    })
    const { root } = setup()
    expect(root.find(Overlay).length).toBe(1)
    expect(root.find(Viewer).length).toBe(1)
  })
})
