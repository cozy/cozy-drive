import { render, screen } from '@testing-library/react'
import { useCurrentFileId } from 'hooks'
import React from 'react'

import CozyClient, { useQuery } from 'cozy-client'

import { getEncryptionKeyFromDirId } from 'lib/encryption'
import AppLike from 'test/components/AppLike'
import { generateFile } from 'test/generate'

import FilesViewer from './FilesViewer'

jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())
jest.mock('cozy-keys-lib', () => ({
  useVaultClient: jest.fn()
}))

jest.mock('lib/encryption', () => ({
  ...jest.requireActual('lib/encryption'),
  getEncryptionKeyFromDirId: jest.fn(),
  getDecryptedFileURL: jest.fn()
}))

jest.mock('hooks')

jest.mock('cozy-ui/transpiled/react/Viewer', () => () => <div>Viewer</div>)

const sleep = duration => new Promise(resolve => setTimeout(resolve, duration))

describe('FilesViewer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const setup = ({
    fileId = 'file-foobar0',
    nbFiles = 3,
    totalCount,
    client = new CozyClient({}),
    vaultClient = {},
    useQueryResultAttributes,
    isEncrypted = false
  } = {}) => {
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

    useCurrentFileId.mockReturnValue(fileId)

    return render(
      <AppLike client={client} vaultClient={vaultClient}>
        <FilesViewer
          files={filesFixture}
          filesQuery={mockedUseQueryReturnedValues}
        />
      </AppLike>
    )
  }

  it('should render a Viewer', async () => {
    setup()

    const viewer = await screen.findByText('Viewer')
    expect(viewer).toBeInTheDocument()
  })

  it('should fetch the file if necessary', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile({ i: '51' })
    })

    setup({
      client,
      nbFiles: 50,
      totalCount: 100,
      fileId: 'file-foobar51'
    })

    const viewer = await screen.findByText('Viewer')
    expect(viewer).toBeInTheDocument()
    expect(client.query).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'file-foobar51',
        doctype: 'io.cozy.files'
      })
    )
  })

  it.skip('should fetch more files if necessary', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile({ i: '51' })
    })
    const fetchMore = jest.fn().mockImplementation(async () => {
      await sleep(10)
    })

    setup({
      client,
      nbFiles: 50,
      totalCount: 100,
      fileId: 'file-foobar48',
      useQueryResultAttributes: {
        fetchMore
      }
    })

    const viewer = await screen.findByText('Viewer')
    expect(viewer).toBeInTheDocument()
    expect(fetchMore).toHaveBeenCalledTimes(1)
  })

  it('should get decryption key when file is encrypted', async () => {
    // useEffect calling fetchMoreIfNecessary leaks with encrypted file
    // these prevent CI to break until we resolve the problem
    jest.spyOn(console, 'error').mockImplementation()

    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: generateFile({ i: '0', encrypted: true })
    })

    setup({
      client,
      nbFiles: 1,
      totalCount: 1,
      fileId: 'file-foobar0',
      isEncrypted: true
    })

    const viewer = await screen.findByText('Viewer')
    expect(viewer).toBeInTheDocument()
    expect(getEncryptionKeyFromDirId).toHaveBeenCalled()
  })
})
