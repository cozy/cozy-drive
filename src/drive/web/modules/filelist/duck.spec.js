import { isThereFileWithThisMetadata } from './duck'

let files

describe('isThereFileWithThisMetadata', () => {
  beforeEach(() => {
    files = [
      {
        id: 'dir01'
      },
      {
        id: 'file01'
      }
    ]
  })

  it('should return false if no file with metadata', () => {
    expect(
      isThereFileWithThisMetadata({ files, attribute: 'specificMetadata' })
    ).toBeFalsy()
  })

  it('should return false if no file with specific metadata', () => {
    files.push({
      id: 'file02',
      metadata: {}
    })
    expect(
      isThereFileWithThisMetadata({ files, attribute: 'specificMetadata' })
    ).toBeFalsy()
  })

  it('should return true if at least one file have specific metadata', () => {
    files.push({
      id: 'file03',
      metadata: { specificMetadata: true }
    })
    expect(
      isThereFileWithThisMetadata({ files, attribute: 'specificMetadata' })
    ).toBeTruthy()
  })

  it('should return false if files are empty', () => {
    files = []
    expect(
      isThereFileWithThisMetadata({ files, attribute: 'specificMetadata' })
    ).toBeFalsy()
  })

  it('should return false if files are undefined', () => {
    files = undefined
    expect(
      isThereFileWithThisMetadata({ files, attribute: 'specificMetadata' })
    ).toBeFalsy()
  })
})
