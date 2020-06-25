import { useFilesQueryWithPath } from './useFilesQueryWithPath'
import { useQuery } from 'cozy-client'
jest.mock('cozy-client/dist/hooks/useQuery', () => jest.fn())

describe('useFilesWithPath', () => {
  it('test if the parent path is assigned to the file displayedPath', () => {
    useQuery
      .mockReturnValueOnce({
        data: [{ dir_id: 1, _id: 'file1' }, { dir_id: 2, id: 'file2' }]
      })
      .mockReturnValueOnce({
        fetchStatus: 'loaded',
        data: [{ _id: 1, path: '/a' }, { _id: 2, path: '/b' }]
      })
    const result = useFilesQueryWithPath({ definition: '', options: '' })
    expect(result).toEqual({
      data: [
        {
          dir_id: 1,
          displayedPath: '/a',
          _id: 'file1'
        },
        {
          dir_id: 2,
          id: 'file2',
          displayedPath: '/b'
        }
      ]
    })
  })
})
