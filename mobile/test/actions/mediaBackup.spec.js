import {
  MEDIA_UPLOAD_START, MEDIA_UPLOAD_END, IMAGE_UPLOAD_SUCCESS,
  startMediaUpload, endMediaUpload, successImageUpload
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

  it('should create an action to success image upload', () => {
    const photo = { id: 1 }
    const expectedAction = { type: IMAGE_UPLOAD_SUCCESS, id: photo.id }
    expect(successImageUpload(photo)).toEqual(expectedAction)
  })
})
