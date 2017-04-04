import reducer, { initialState } from '../../src/reducers/ui'
import { SHOW_UNLINK_CONFIRMATION, HIDE_UNLINK_CONFIRMATION } from '../../src/actions/unlink'
import { INIT_STATE } from '../../../src/actions'

describe('ui reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}))
    .toEqual(initialState)
  })

  it('should handle SHOW_UNLINK_CONFIRMATION', () => {
    expect(reducer({displayUnlinkConfirmation: false}, {type: SHOW_UNLINK_CONFIRMATION}))
    .toEqual({displayUnlinkConfirmation: true})
  })

  it('should handle HIDE_UNLINK_CONFIRMATION', () => {
    expect(reducer({displayUnlinkConfirmation: true}, {type: HIDE_UNLINK_CONFIRMATION}))
    .toEqual({displayUnlinkConfirmation: false})
  })

  it('should handle INIT_STATE', () => {
    expect(reducer({displayUnlinkConfirmation: true}, {type: INIT_STATE}))
    .toEqual(initialState)
  })
})
