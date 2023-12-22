import { getEntriesType } from 'drive/lib/entries'

describe('getEntriesType', () => {
  it('should return file for entries only file', () => {
    const res = getEntriesType([
      { type: 'file' },
      { type: 'file' },
      { type: 'file' }
    ])
    expect(res).toBe('file')
  })

  it('should return folder for entries only folder', () => {
    const res = getEntriesType([
      { type: 'directory' },
      { type: 'directory' },
      { type: 'directory' }
    ])
    expect(res).toBe('directory')
  })

  it('should return element for entries with multiples types', () => {
    const res = getEntriesType([
      { type: 'file' },
      { type: 'directory' },
      { type: 'file' }
    ])
    expect(res).toBe('element')
  })

  it('should return element if something else from file or directory', () => {
    const res = getEntriesType([
      { type: 'something' },
      { type: 'something' },
      { type: 'something' }
    ])
    expect(res).toBe('element')
  })
})
