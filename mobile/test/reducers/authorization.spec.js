import { authorization as reducer } from '../../src/reducers/authorization'
import { unrevokeClient, revokeClient } from '../../src/actions/authorization'

describe('authorization state', () => {
  it('should set the revoked flag', () => {
    expect(reducer(undefined, revokeClient()))
    .toEqual({ revoked: true })
  })

  it('should set the revoked flag', () => {
    expect(reducer(undefined, unrevokeClient()))
    .toEqual({ revoked: false })
  })
})
