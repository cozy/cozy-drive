import getSharedDocument from './getSharedDocument'

describe('Getting the shared document id', () => {
  const mockClient = {
    collection: () => ({
      getOwnPermissions: jest.fn().mockReturnValue({
        data: {
          attributes: {
            permissions: {
              collection: {
                type: 'io.cozy.photos.albums',
                verbs: ['GET'],
                values: ['myshareid']
              },
              files: {
                selector: 'referenced_by',
                type: 'io.cozy.files',
                values: ['io.cozy.photos.albums/myshareid'],
                verbs: ['GET']
              }
            }
          }
        }
      })
    })
  }

  it('should get the id', async () => {
    const id = await getSharedDocument(mockClient)
    expect(id).toEqual('myshareid')
  })
})
