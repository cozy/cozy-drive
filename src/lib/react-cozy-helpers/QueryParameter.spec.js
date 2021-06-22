import getQueryParameter from './QueryParameter'

describe('getQueryParameter', () => {
  it('should decode URI string', () => {
    const params = {
      username: 'N%C3%B6%C3%A9'
    }

    delete window.location
    window.location = {
      search: `?username=${params.username}`
    }
    const { username } = getQueryParameter()

    expect(username).toBe('Nöé')
  })

  it('should keep string with accent unchanged', () => {
    const params = {
      username: 'Nöé'
    }

    delete window.location
    window.location = {
      search: `?username=${params.username}`
    }
    const { username } = getQueryParameter()

    expect(username).toBe('Nöé')
  })

  it('should not modify string with special characters', () => {
    const params = {
      sharecode: 'eyJ_hbGc/iOiJ.S3mJz-B90iu.8D0#JwCK'
    }

    delete window.location
    window.location = {
      search: `?sharecode=${params.sharecode}`
    }
    const { sharecode } = getQueryParameter()

    expect(sharecode).toBe('eyJ_hbGc/iOiJ.S3mJz-B90iu.8D0#JwCK')
  })
})
