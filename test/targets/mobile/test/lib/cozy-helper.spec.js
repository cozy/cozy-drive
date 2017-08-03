import { checkURL, SCHEME_EXCEPTION, MAIL_EXCEPTION } from '../../../../../src/targets/mobile/lib/cozy-helper'

describe('cozy-helper checkURL', () => {
  it('should accept https://localhost', () => {
    const url = 'https://localhost'
    expect(checkURL(url)).toEqual(url)
  })

  it('should not accept http://', () => {
    const url = 'http://localhost'
    try {
      checkURL(url)
    } catch (err) {
      expect(err.name).toEqual(SCHEME_EXCEPTION)
    }
  })

  it('should not accept @', () => {
    const mail = 'yo@lo.fr'
    try {
      checkURL(mail)
    } catch (err) {
      expect(err.name).toEqual(MAIL_EXCEPTION)
    }
  })

  it('should accept url without scheme://', () => {
    const url = 'localhost'
    expect(checkURL('localhost')).toEqual('https://' + url)
  })
})
