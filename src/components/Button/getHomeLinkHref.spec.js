import getHomeLinkHref from './getHomeLinkHref'

describe('getHomeLinkHref', () => {
  it('Should add the origin parameter', () => {
    expect(getHomeLinkHref('cozy.io')).toEqual(
      'https://manager.cozycloud.cc/cozy/create?pk_campaign=cozy.io'
    )
  })
  it('Should not add the origin parameter', () => {
    expect(getHomeLinkHref('')).toEqual(
      'https://manager.cozycloud.cc/cozy/create'
    )
  })
})
