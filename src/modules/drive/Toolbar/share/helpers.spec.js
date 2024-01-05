import { getPathToShareDisplayedFolder } from 'modules/drive/Toolbar/share/helpers'

describe('getPathToShareDisplayedFolder', () => {
  it('should return path to displayed folder share modal', () => {
    expect(getPathToShareDisplayedFolder('/path/to/folder/123')).toBe(
      '/path/to/folder/123/share'
    )
  })

  it('should return correct path if pathname ends with /', () => {
    expect(getPathToShareDisplayedFolder('/path/to/folder/123/')).toBe(
      '/path/to/folder/123/share'
    )
  })
})
