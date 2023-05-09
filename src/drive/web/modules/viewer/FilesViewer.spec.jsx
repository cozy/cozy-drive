import React from 'react'
import { mount } from 'enzyme'
import { Overlay, Viewer } from 'cozy-ui/transpiled/react'
import FilesViewer from './FilesViewer'
import CozyClient, { useQuery } from 'cozy-client'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'
import { act } from 'react-dom/test-utils'
import { getEncryptionKeyFromDirId } from 'drive/lib/encryption'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))

jest.mock('drive/lib/encryption', () => ({
  ...jest.requireActual('drive/lib/encryption'),
  getEncryptionKeyFromDirId: jest.fn(),
  getDecryptedFileURL: jest.fn()
}))

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('FilesViewer', () => {
  const setup = ({
    fileId = 'file-foobar0',
    nbFiles = 3,
    totalCount,
    client = new CozyClient({}),
    vaultClient = {},
    useQueryResultAttributes,
    isEncrypted = false
  } = {}) => {
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

    const filesFixture = Array(nbFiles)
      .fill(null)
      .map((x, i) => generateFile({ i, type: 'file', encrypted: isEncrypted }))
    const mockedUseQueryReturnedValues = {
      data: filesFixture,
      count: totalCount || filesFixture.length,
      fetchMore: jest.fn().mockImplementation(() => {
        throw new Error('Fetch more should not be called')
      }),
      ...useQueryResultAttributes
    }
    useQuery.mockReturnValue(mockedUseQueryReturnedValues)

    const root = mount(
      <AppLike client={client} vaultClient={vaultClient} store={store}>
        <FilesViewer
          client={client}
          vaultClient={vaultClient}
          fileId={fileId}
          files={filesFixture}
          filesQuery={mockedUseQueryReturnedValues}
        />
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

  it('should fetch the file if necessary', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile({ i: '51' })
    })
    await act(async () => {
      const { root } = await setup({
        client,
        nbFiles: 50,
        totalCount: 100,
        fileId: 'file-foobar51'
      })
      await sleep(0)

      root.update()
      expect(root.find(Overlay).length).toBe(1)
      expect(root.find(Viewer).length).toBe(1)
      expect(client.query).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'file-foobar51',
          doctype: 'io.cozy.files'
        })
      )
    })
  })

  // https://github.com/cozy/cozy-drive/issues/2910
  // TODO: Fix this flaky test
  it.skip('should fetch more files if necessary', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile({ i: '51' })
    })
    const fetchMore = jest.fn().mockImplementation(async () => {
      await sleep(10)
    })
    const { root } = setup({
      client,
      nbFiles: 50,
      totalCount: 100,
      fileId: 'file-foobar48',
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

  it('should get decyrption key when file is encrypted', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile({ i: '0', encrypted: true })
    })
    await act(async () => {
      const { root } = await setup({
        client,
        nbFiles: 1,
        totalCount: 1,
        fileId: 'file-foobar0',
        isEncrypted: true
      })
      root.update()
      expect(root.find(Viewer).length).toBe(1)

      expect(getEncryptionKeyFromDirId).toHaveBeenCalled()
    })
  })
})
