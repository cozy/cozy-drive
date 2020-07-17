import { isClientAlreadyInstalled, DESKTOP_SOFTWARE_ID } from './index'
import CozyClient from 'cozy-client'

describe('isClientAlreadyInstalled', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  test('isClientAlreadyInstalled is true', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: {
        0: {
          attributes: {
            software_id: DESKTOP_SOFTWARE_ID
          }
        }
      }
    })
    const isInstalled = await isClientAlreadyInstalled(client)
    expect(isInstalled).toBe(true)
  })
  test('isClientAlreadyInstalled is not installed', async () => {
    const client = new CozyClient({})
    client.query = jest.fn().mockResolvedValue({
      data: {
        0: {
          attributes: {
            software_id: test
          }
        }
      }
    })
    const isInstalled = await isClientAlreadyInstalled(client)
    expect(isInstalled).toBe(false)
  })
})
