import CozyClient from 'cozy-client'
import flag from 'cozy-flags'

import { getEncryptionKeyFromDirId } from './encryption'

jest.mock('cozy-flags', () => jest.fn())

describe('encryption', () => {
  const client = new CozyClient({})
  beforeEach(() => {
    client.query = jest.fn().mockResolvedValue({
      data: {
        key: 'super-secret-key'
      }
    })
  })
  it('should return nothing when flag is not set', async () => {
    const key = await getEncryptionKeyFromDirId(client, null)
    expect(key).toBeNull()
  })

  it('should return encryption key when flag is set', async () => {
    flag.mockReturnValue('drive.enable-encryption')

    const key = await getEncryptionKeyFromDirId(client, null)
    expect(key).toBe('super-secret-key')
  })
})
