import { getSharingIdFromUrl } from './utils'

describe('getSharingIdFromUrl', () => {
  it('should return sharing id from url', () => {
    const urlWithoutSharingId = new URL('https://test.mycozy.cloud/')
    const urlWithSharingId = new URL('https://test.mycozy.cloud/?sharing=123')

    expect(getSharingIdFromUrl(urlWithoutSharingId)).toBeNull()
    expect(getSharingIdFromUrl(urlWithSharingId)).toBe('123')
  })
})
