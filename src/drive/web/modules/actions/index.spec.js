import { download, duplicate } from './index'
import { DOCTYPE_FILES_ENCRYPTION } from 'lib/doctypes'

describe('download', () => {
  it('should not display when an encrypted folder is selected', () => {
    const files = [
      {
        type: 'directory',
        referenced_by: [
          {
            type: DOCTYPE_FILES_ENCRYPTION,
            id: '123'
          }
        ]
      }
    ]
    const dl = download({ client: {}, vaultClient: {} })
    expect(dl.displayCondition(files)).toBe(false)
  })

  it('should not display when several encrypted files are selected', () => {
    const files = [
      {
        type: 'file',
        encrypted: true
      },
      {
        type: 'file',
        encrypted: true
      }
    ]
    const dl = download({ client: {}, vaultClient: {} })
    expect(dl.displayCondition(files)).toBe(false)
  })

  it('should display when a single encrypted file is selected', () => {
    const files = [
      {
        type: 'file',
        encrypted: true
      }
    ]
    const dl = download({ client: {}, vaultClient: {} })
    expect(dl.displayCondition(files)).toBe(true)
  })

  it('should display when selection does not include encrypted folder nor file', () => {
    const files = [
      {
        type: 'file'
      },
      {
        type: 'directory'
      }
    ]
    const dl = download({ client: {}, vaultClient: {} })
    expect(dl.displayCondition(files)).toBe(true)
  })
})

describe('duplicate', () => {
  it('should not display when several files are selected', () => {
    const files = [
      {
        type: 'file'
      },
      {
        type: 'file'
      }
    ]
    const cp = duplicate({ client: {}, hasWriteAccess: true })
    expect(cp.displayCondition(files)).toBe(false)
  })

  it('should not display when type is directory', () => {
    const files = [
      {
        type: 'directory'
      }
    ]
    const cp = duplicate({ client: {}, hasWriteAccess: true })
    expect(cp.displayCondition(files)).toBe(false)
  })

  it('should display when type is file', () => {
    const files = [
      {
        type: 'file'
      }
    ]
    const cp = duplicate({ client: {}, hasWriteAccess: true })
    expect(cp.displayCondition(files)).toBe(true)
  })

  it('should not display when no write access', () => {
    const files = [
      {
        type: 'file'
      }
    ]
    const cp = duplicate({ client: {}, hasWriteAccess: false })
    expect(cp.displayCondition(files)).toBe(false)
  })
})
