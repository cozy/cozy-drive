import { createMockClient, models } from 'cozy-client'

import { makeNormalizedFile, TYPE_DIRECTORY } from './helpers'

jest.mock('./iconContext', () => ({ getIconUrl: () => 'iconUrl' }))
models.note.fetchURL = jest.fn(() => 'noteUrl')

const client = createMockClient({})

const noteFileProps = {
  name: 'note.cozy-note',
  metadata: {
    content: '',
    schema: '',
    title: '',
    version: ''
  }
}

describe('makeNormalizedFile', () => {
  it('should return correct values for a directory', () => {
    const folders = []
    const file = {
      _id: 'fileId',
      type: TYPE_DIRECTORY,
      path: 'filePath',
      name: 'fileName'
    }

    const normalizedFile = makeNormalizedFile(client, folders, file)

    expect(normalizedFile).toEqual({
      icon: 'iconUrl',
      id: 'fileId',
      name: 'fileName',
      path: 'filePath',
      url: 'http://localhost/#/folder/fileId'
    })
  })

  it('should return correct values for a file', () => {
    const folders = [{ _id: 'folderId', path: 'folderPath' }]
    const file = {
      _id: 'fileId',
      dir_id: 'folderId',
      type: 'file',
      name: 'fileName'
    }

    const normalizedFile = makeNormalizedFile(client, folders, file)

    expect(normalizedFile).toEqual({
      icon: 'iconUrl',
      id: 'fileId',
      name: 'fileName',
      path: 'folderPath',
      url: 'http://localhost/#/folder/folderId/file/fileId'
    })
  })

  it('should return correct values for a note with on Select function - better for performance', () => {
    const folders = [{ _id: 'folderId', path: 'folderPath' }]
    const file = {
      _id: 'fileId',
      id: 'noteId',
      dir_id: 'folderId',
      type: 'file',
      name: 'fileName',
      ...noteFileProps
    }

    const normalizedFile = makeNormalizedFile(client, folders, file)

    expect(normalizedFile).toEqual({
      icon: 'iconUrl',
      id: 'fileId',
      name: 'note.cozy-note',
      path: 'folderPath',
      onSelect: 'id_note:noteId'
    })
  })

  it('should not return filled onSelect for a note without metadata', () => {
    const folders = [{ _id: 'folderId', path: 'folderPath' }]
    const file = {
      _id: 'fileId',
      id: 'noteId',
      dir_id: 'folderId',
      type: 'file',
      name: 'note.cozy-note'
    }

    const normalizedFile = makeNormalizedFile(client, folders, file)

    expect(normalizedFile).toEqual({
      icon: 'iconUrl',
      id: 'fileId',
      name: 'note.cozy-note',
      path: 'folderPath',
      onSelect: undefined,
      url: 'http://localhost/#/folder/folderId/file/fileId'
    })
  })
})
