import reducer, { initialState } from '../../src/reducers/settings'
import { INIT_STATE } from '../../../src/actions/settings'
import { SET_URL, ERROR, SET_ANALYTICS } from '../../src/actions/settings'

describe('settings reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}))
    .toEqual(initialState)
  })

  it('should handle SET_URL', () => {
    const url = 'http://localhost'
    expect(reducer({serverUrl: '', error: 'defined', authorized: false}, {type: SET_URL, url: url}))
    .toEqual({serverUrl: url, error: null, authorized: false})
  })

  it('should handle SET_ANALYTICS', () => {
    expect(reducer({analytics: false}, {type: SET_ANALYTICS, analytics: true})).toEqual({analytics: true})
    expect(reducer({analytics: true}, {type: SET_ANALYTICS, analytics: false})).toEqual({analytics: false})
  })

  it('should handle ERROR', () => {
    const msg = 'error'
    expect(reducer({error: null}, {type: ERROR, error: msg}))
    .toEqual({error: msg})
  })

  it('should handle INIT_STATE', () => {
    expect(reducer({serverUrl: 'serverUrl', backupImages: true, error: 'error'}, {type: INIT_STATE}))
    .toEqual(initialState)
  })
})
