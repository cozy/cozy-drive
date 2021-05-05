import { useQuery } from 'cozy-client'

import { TRASH_DIR_ID } from 'drive/constants/config'
import {
  isFileNotTrashed,
  useFilesQueryWithPath,
  useFileWithPath
} from './hooks'

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

test('excludeTrashedFiles', () => {
  const trashedFile1 = {
    _id: 1,
    dir_id: TRASH_DIR_ID
  }
  const trashedFile2 = {
    _id: 3,
    dir_id: 'bug',
    trashed: true
  }
  const trashedFolder = {
    _id: 3,
    dir_id: TRASH_DIR_ID
  }
  const folder1 = {
    _id: 4,
    type: 'folder',
    dir_id: '1'
  }
  const file1 = {
    _id: 1,
    type: 'file',
    dir_id: '1'
  }
  const file2 = {
    _id: 1,
    type: 'file',
    dir_id: '1',
    trashed: false
  }
  expect(
    [trashedFile1, trashedFile2, trashedFolder, folder1, file1, file2].filter(
      isFileNotTrashed
    )
  ).toEqual([folder1, file1, file2])
})

describe('useFileWithPath', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return null data while all queries are not finished', () => {
    useQuery
      .mockReturnValueOnce({ data: null, fetchStatus: 'loading' })
      .mockReturnValue({ data: null, fetchStatus: 'loading' })

    expect(useFileWithPath('fakeId')).toMatchObject({ data: null })

    useQuery.mockClear()

    useQuery
      .mockReturnValueOnce({ data: { id: 'fakeId' }, fetchStatus: 'loaded' })
      .mockReturnValue({ data: null, fetchStatus: 'loading' })

    expect(useFileWithPath('fakeId')).toMatchObject({ data: null })

    useQuery.mockClear()

    useQuery
      .mockReturnValueOnce({ data: null, fetchStatus: 'loading' })
      .mockReturnValue({ data: { path: '/path' }, fetchStatus: 'loaded' })

    expect(useFileWithPath('fakeId')).toMatchObject({ data: null })
  })

  it('should return data with undefined displayedPath if no parent path', () => {
    useQuery
      .mockReturnValueOnce({ data: { id: 'fakeId' }, fetchStatus: 'loaded' })
      .mockReturnValue({ data: {}, fetchStatus: 'loaded' })

    expect(useFileWithPath('fakeId')).toMatchObject({
      data: { id: 'fakeId', displayedPath: undefined }
    })

    useQuery.mockClear()

    useQuery
      .mockReturnValueOnce({ data: { id: 'fakeId' }, fetchStatus: 'loaded' })
      .mockReturnValue({ data: null, fetchStatus: 'loaded' })

    expect(useFileWithPath('fakeId')).toMatchObject({
      data: { id: 'fakeId', displayedPath: undefined }
    })
  })

  it('should return data with displayed path', () => {
    useQuery
      .mockReturnValueOnce({ data: { id: 'fakeId' }, fetchStatus: 'loaded' })
      .mockReturnValue({ data: { path: '/path' }, fetchStatus: 'loaded' })

    expect(useFileWithPath('fakeId')).toMatchObject({
      data: { id: 'fakeId', displayedPath: '/path' }
    })
  })
})
