import { areTargetsInCurrentDir } from './helpers'

describe('areTargetsInCurrentDir', () => {
  it('should return false if the current folder is undefined', () => {
    const targets = [
      { _id: 'folder1', path: '/folder1' },
      { _id: 'folder2', path: '/folder2' }
    ]
    const folder = undefined

    expect(areTargetsInCurrentDir(targets, folder)).toBe(false)
  })

  it('should return true if all targets are in the current folder', () => {
    const targets = [
      { _id: 'folder1', path: '/folder1', dir_id: 'currentFolder' },
      { _id: 'folder2', path: '/folder2', dir_id: 'currentFolder' }
    ]
    const folder = { _id: 'currentFolder', path: '/currentFolder' }

    expect(areTargetsInCurrentDir(targets, folder)).toBe(true)
  })

  it('should return false if not all targets are in the current folder', () => {
    const targets = [
      { _id: 'folder1', path: '/folder1', dir_id: 'currentFolder' },
      { _id: 'folder2', path: '/folder2', dir_id: 'otherFolder' }
    ]
    const folder = { _id: 'currentFolder', path: '/currentFolder' }

    expect(areTargetsInCurrentDir(targets, folder)).toBe(false)
  })

  it('should return true if all targets are in the root folder', () => {
    const targets = [
      { _id: 'folder1', path: '/folder1' },
      { _id: 'file1', path: '/file1.png' }
    ]
    const folder = { _id: 'io.cozy.files.root-dir', path: '/' }

    expect(areTargetsInCurrentDir(targets, folder)).toBe(true)
  })

  it('should return true if all targets are in a subfolder', () => {
    const targets = [
      { _id: 'folder3', path: '/folder1/folder2/folder3' },
      { _id: 'file1', path: '/folder1/folder2/file1.png' }
    ]
    const folder = { _id: 'folder2', path: '/folder1/folder2' }

    expect(areTargetsInCurrentDir(targets, folder)).toBe(true)
  })

  it('should return false if all targets deeper inside subfolders', () => {
    const targets = [
      { _id: 'folder3', path: '/folder1/folder2/folder3' },
      { _id: 'file1', path: '/folder1/folder2/file1.png' }
    ]
    const folder = { _id: 'folder1', path: '/folder1' }

    expect(areTargetsInCurrentDir(targets, folder)).toBe(false)
  })
})
