import { mergeFilesWithParents } from './actions'

describe('Navigation Duck Actions MergeFilesWithParents', () => {
  it('should work', () => {
    const files = [
      {
        id: 1,
        _id: 1,
        name: 'file 1',
        dir_id: 'exist'
      }
    ]

    const folders = {
      total_rows: 1,
      rows: [
        {
          id: 'exist',
          key: 'exist',
          doc: {
            _id: 'exist',
            name: 'folder exists',
            path: 'exist/'
          }
        }
      ]
    }
    const filesWithParents = mergeFilesWithParents(files, folders)
    expect(filesWithParents).toEqual([
      { _id: 1, dir_id: 'exist', id: 1, name: 'file 1', path: 'exist/' }
    ])
  })

  it('should also work if the parent doesnt exist anymore due to "CouchDB / Stack" issue', () => {
    const files = [
      {
        id: 1,
        _id: 1,
        name: 'file 1',
        dir_id: 'exist'
      }
    ]

    const folders = {
      total_rows: 1,
      rows: [
        {
          id: 'exist',
          key: 'exist',
          doc: null
        }
      ]
    }
    const filesWithParents = mergeFilesWithParents(files, folders)
    expect(filesWithParents).toEqual([
      { _id: 1, dir_id: 'exist', id: 1, name: 'file 1', path: '' }
    ])
  })
})
