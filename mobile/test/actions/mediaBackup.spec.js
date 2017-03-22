import {
  MEDIA_UPLOAD_START, MEDIA_UPLOAD_END, MEDIA_UPLOAD_SUCCESS,
  startMediaUpload, endMediaUpload, successMediaUpload
} from '../../src/actions/mediaBackup'

describe('mediaBackup actions', () => {
  it('should create an action to start media upload', () => {
    const expectedAction = { type: MEDIA_UPLOAD_START }
    expect(startMediaUpload()).toEqual(expectedAction)
  })

  it('should create an action to end media upload', () => {
    const expectedAction = { type: MEDIA_UPLOAD_END }
    expect(endMediaUpload()).toEqual(expectedAction)
  })

  it('should create an action to success media upload', () => {
    const photo = { id: 1 }
    const expectedAction = { type: MEDIA_UPLOAD_SUCCESS, id: photo.id }
    expect(successMediaUpload(photo)).toEqual(expectedAction)
  })
})
