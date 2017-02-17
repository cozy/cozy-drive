import reducer, { initialState } from '../../src/reducers/mediaBackup'
import { MEDIA_UPLOAD_START, MEDIA_UPLOAD_END, IMAGE_UPLOAD_SUCCESS } from '../../src/actions/mediaBackup'
import { INIT_STATE } from '../../src/actions'

describe('mediaBackup reducers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {}))
    .toEqual(initialState)
  })

  it('should handle MEDIA_UPLOAD_START', () => {
    expect(reducer({uploading: false}, {type: MEDIA_UPLOAD_START}))
    .toEqual({uploading: true})
  })

  it('should handle MEDIA_UPLOAD_END', () => {
    expect(reducer({uploading: true}, {type: MEDIA_UPLOAD_END}))
    .toEqual({uploading: false})
  })

  it('should handle IMAGE_UPLOAD_SUCCESS', () => {
    expect(reducer({uploaded: []}, {type: IMAGE_UPLOAD_SUCCESS, id: 1}))
    .toEqual({uploaded: [1]})

    expect(reducer({uploaded: [1]}, {type: IMAGE_UPLOAD_SUCCESS, id: 2}))
    .toEqual({uploaded: [1, 2]})
  })

  it('should handle INIT_STATE', () => {
    expect(reducer({uploading: true, uploaded: [1, 2]}, {type: INIT_STATE}))
    .toEqual(initialState)
  })
})
