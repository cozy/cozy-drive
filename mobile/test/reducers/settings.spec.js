import reducer, { initialState } from '../../src/reducers/settings'
import { INIT_STATE } from '../../src/actions'
import { SET_URL, ERROR, BACKUP_IMAGES_DISABLE, BACKUP_IMAGES_ENABLE, SET_CLIENT } from '../../src/actions/settings'

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

  it('should handle BACKUP_IMAGES_DISABLE', () => {
    expect(reducer({backupImages: true}, {type: BACKUP_IMAGES_DISABLE}))
    .toEqual({backupImages: false})
  })

  it('should handle BACKUP_IMAGES_ENABLE', () => {
    expect(reducer({backupImages: false}, {type: BACKUP_IMAGES_ENABLE}))
    .toEqual({backupImages: true})
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

  it('should set a client into the state with "SET_CLIENT"', () => {
    const client = { someParameter: 'Some Value' }
    expect(reducer(undefined, { type: SET_CLIENT, client }).client).toEqual(client)
  })
})
