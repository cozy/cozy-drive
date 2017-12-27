import DataAccessFacade from '../DataAccessFacade'

describe('DataAccessFacade', () => {
  global.cozy = {
    client: {
      init: jest.fn()
    }
  }

  const facade = new DataAccessFacade()

  it('without files doctype: should call cozy.client.init with the proper configuration', () => {
    const cozyURL = 'https://localhost'
    const doctypes = ['this', 'is', 'a', 'test']

    facade.setup(cozyURL, {
      offline: { doctypes }
    })

    expect(global.cozy.client.init.mock.calls[0][0]).toEqual({
      offline: { doctypes },
      cozyURL
    })
  })

  it('with files doctype: should call cozy.client.init with the proper configuration', () => {
    const filesDoctype = 'io.cozy.files'
    const cozyURL = 'https://localhost'
    const doctypes = ['this', 'is', 'a', 'test', filesDoctype]

    facade.setup(cozyURL, {
      offline: { doctypes }
    })

    expect(global.cozy.client.init.mock.calls[1][0]).toEqual({
      offline: { doctypes: [filesDoctype] },
      cozyURL
    })
  })
})
