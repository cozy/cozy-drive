import React from 'react'
import { mount } from 'enzyme'
import { Overlay, Viewer } from 'cozy-ui/transpiled/react'
import FilesViewer from './FilesViewerV2'
import CozyClient, { useQuery } from 'cozy-client'
import AppLike from 'test/components/AppLike'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

const generateFile = i => ({
  dir_id: 'io.cozy.files.root-dir',
  displayedPath: '/',
  id: `foobar${i}`,
  name: `foobar${i}.pdf`,
  path: `/foobar${i}.pdf`,
  type: 'file'
})

const generateFiles = nbFiles => {
  const res = []
  for (let i = 0; i < nbFiles; i++) {
    const file = generateFile(i)
    res.push(file)
  }
  return res
}

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('FilesViewer', () => {
  const setup = ({
    fileId = 'foobar0',
    nbFiles = 3,
    totalCount,
    client,
    useQueryResultAttributes
  } = {}) => {
    client = client || new CozyClient({})
    const store = {
      subscribe: () => {},
      getState: () => ({
        view: {
          sort: {
            sortAttribute: 'name',
            sortOrder: 'desc'
          }
        },
        router: {
          params: {
            fileId: fileId,
            folderId: 'folder-id'
          }
        }
      })
    }

    const filesFixture = generateFiles(nbFiles)
    useQuery.mockReturnValue({
      data: filesFixture,
      count: totalCount || filesFixture.length,
      fetchMore: jest.fn().mockImplementation(() => {
        throw new Error('Fetch more should not be called')
      }),
      ...useQueryResultAttributes
    })

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
    const { root } = setup()
    expect(root.find(Overlay).length).toBe(1)
    expect(root.find(Viewer).length).toBe(1)
  })

  it('should use sort attribute/order from state', () => {
    const { root } = setup()
    expect(root.find(Overlay).length).toBe(1)
    expect(root.find(Viewer).length).toBe(1)
    expect(useQuery).toHaveBeenCalledWith(expect.any(Function), {
      as: 'file-folder-id-name-desc',
      fetchPolicy: expect.any(Function)
    })
  })

  it('should fetch the file if necessary', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile('51')
    })
    const { root } = setup({
      client,
      nbFiles: 50,
      totalCount: 100,
      fileId: 'foobar51'
    })

    expect(root.find(Viewer).length).toBe(0)

    // Let promise resolve
    await sleep(0)

    root.update()

    expect(root.find(Overlay).length).toBe(1)
    expect(root.find(Viewer).length).toBe(1)
    expect(client.query).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'foobar51',
        doctype: 'io.cozy.files'
      })
    )
  })

  it('should fetch more files if necessary', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile('51')
    })
    const fetchMore = jest.fn().mockImplementation(async () => {
      await sleep(10)
    })
    const { root } = setup({
      client,
      nbFiles: 50,
      totalCount: 100,
      fileId: 'foobar48',
      useQueryResultAttributes: {
        fetchMore
      }
    })

    // Let promise resolve
    await sleep(0)

    root.update()

    expect(root.find(Overlay).length).toBe(1)
    expect(root.find(Viewer).length).toBe(1)
    expect(fetchMore).toHaveBeenCalledTimes(1)
  })
})
