import { fetchFolder } from './fetchFolder'
import { buildFolderQuery } from 'drive/web/modules/queries'

jest.mock('drive/web/modules/queries')

describe('fetchFolder', () => {
  const folderReturnedByCozyClient = 'folder'
  const result = { data: [folderReturnedByCozyClient, 'another data'] }
  const client = {
    fetchQueryAndGetFromState: jest.fn().mockReturnValue(result)
  }
  const folderId = '1234'
  const definition = jest.fn().mockReturnValue('definition')

  beforeEach(() => {
    buildFolderQuery.mockReturnValue({
      definition: definition,
      options: 'options'
    })
  })

  it('should return answer from fetchQueryAndGetFromState', async () => {
    // When
    const folder = await fetchFolder({ client, folderId })

    // Then
    expect(folder).toEqual(folderReturnedByCozyClient)
  })

  it('should call fetchQueryAndGetFromState with correct definition and options', async () => {
    // When
    await fetchFolder({ client, folderId })

    // Then
    expect(definition).toHaveBeenCalledWith()
    expect(client.fetchQueryAndGetFromState).toHaveBeenCalledWith({
      definition: 'definition',
      options: 'options'
    })
  })
})
