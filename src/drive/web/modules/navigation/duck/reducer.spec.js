import {
  ensureFileHavePath,
  getDisplayedFilePath,
  getFilePath
} from './reducer'

describe('ensureFileHavePath function', () => {
  it('should ensure that the file has path and displayedPath attributes', () => {
    const view = {
      displayedFolder: {
        dir_id: '',
        id: 'io.cozy.files.root-dir',
        name: '',
        path: '/',
        type: 'directory'
      }
    }
    const file = {
      dir_id: 'io.cozy.files.root-dir',
      id: 'foobar',
      name: 'foobar.pdf',
      type: 'file'
    }
    const result = ensureFileHavePath({ view }, file)
    const expected = {
      dir_id: 'io.cozy.files.root-dir',
      displayedPath: '/',
      id: 'foobar',
      name: 'foobar.pdf',
      path: '/foobar.pdf',
      type: 'file'
    }
    expect(result).toEqual(expected)
  })
})

describe('getDisplayedFilePath function', () => {
  it('should return file path if it is present', () => {
    const displayedFolder = null
    const view = { displayedFolder }
    const file = {
      name: 'bar.pdf',
      path: '/',
      type: 'file'
    }
    const result = getDisplayedFilePath({ view }, file)
    const expected = '/'
    expect(result).toEqual(expected)
  })

  it('should return the displayed folder path if file path is unknown', () => {
    const displayedFolder = {
      dir_id: 'io.cozy.files.root-dir',
      id: 'foo',
      name: 'Foo',
      path: '/Foo',
      type: 'directory'
    }
    const view = { displayedFolder }
    const file = {
      dir_id: 'foo',
      id: 'bar',
      name: 'bar',
      type: 'directory'
    }
    const result = getDisplayedFilePath({ view }, file)
    const expected = '/Foo'
    expect(result).toEqual(expected)
  })

  it("should return an empty string if we don't know either file path and displayed folder path", () => {
    const displayedFolder = null
    const file = {
      id: 'foo',
      name: 'foo.pdf',
      type: 'file'
    }
    const view = { displayedFolder }
    const result = getDisplayedFilePath({ view }, file)
    const expected = ''
    expect(result).toEqual(expected)
  })
})

describe('getFilePath function', () => {
  it('should return file path when file is in root folder', () => {
    const displayedFolder = {
      dir_id: '',
      id: 'io.cozy.files.root-dir',
      name: '',
      path: '/',
      type: 'directory'
    }
    const view = { displayedFolder }
    const file = {
      name: 'bar.pdf',
      type: 'file'
    }
    const result = getFilePath({ view }, file)
    const expected = '/bar.pdf'
    expect(result).toEqual(expected)
  })

  it('should return full file path when file is in a folder', () => {
    const displayedFolder = {
      dir_id: 'io.cozy.files.root-dir',
      id: 'my-folder',
      name: 'Folder',
      path: '/folder',
      type: 'directory'
    }
    const view = { displayedFolder }
    const file = {
      name: 'bar.pdf',
      type: 'file'
    }
    const result = getFilePath({ view }, file)
    const expected = '/folder/bar.pdf'
    expect(result).toEqual(expected)
  })

  it('should return the path for directories', () => {
    const displayedFolder = {
      dir_id: 'io.cozy.files.root-dir',
      id: 'foo',
      name: 'Foo',
      path: '/Foo',
      type: 'directory'
    }
    const view = { displayedFolder }
    const file = {
      dir_id: 'foo',
      id: 'bar',
      name: 'Bar',
      path: '/Foo/Bar',
      type: 'directory'
    }
    const result = getFilePath({ view }, file)
    const expected = '/Foo/Bar'
    expect(result).toEqual(expected)
  })

  it('should return the full path when displayedFolder is null', () => {
    const displayedFolder = null
    const file = {
      id: 'foo',
      name: 'foo.pdf',
      path: '/my/path/to',
      type: 'file'
    }
    const view = { displayedFolder }
    const result = getFilePath({ view }, file)
    const expected = '/my/path/to/foo.pdf'
    expect(result).toEqual(expected)
  })
})
