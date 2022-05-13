import { download } from './index'
import { DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'

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
