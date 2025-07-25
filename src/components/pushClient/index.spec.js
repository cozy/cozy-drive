import CozyClient from 'cozy-client'

import { isClientAlreadyInstalled, DESKTOP_SOFTWARE_ID } from './index'

describe('isClientAlreadyInstalled', () => {
  test('isClientAlreadyInstalled is true', async () => {
    const client = new CozyClient({})
    client.fetchQueryAndGetFromState = jest.fn().mockResolvedValue({
      data: {
        0: {
          software_id: DESKTOP_SOFTWARE_ID
        }
      }
    })
    const isInstalled = await isClientAlreadyInstalled(client)
    expect(isInstalled).toBe(true)
  })
  test('isClientAlreadyInstalled is not installed', async () => {
    const client = new CozyClient({})
    client.fetchQueryAndGetFromState = jest.fn().mockResolvedValue({
      data: {
        0: {
          software_id: test
        }
      }
    })
    const isInstalled = await isClientAlreadyInstalled(client)
    expect(isInstalled).toBe(false)
  })
})
