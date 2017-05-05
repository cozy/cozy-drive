/* global describe it expect */

import {
  RECEIVE_PHOTOS,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
  UPLOAD_PHOTOS_FAILURE
} from '../../src/constants/actionTypes'

import { photos } from '../../src/reducers/photos'

const mockFetchedPhotos = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac8',
    metadata: {
      datetime: '0001-01-01T00:00:00Z'
    },
    name: 'MonImage.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  }
]

const mockUploadedPhoto = mockFetchedPhotos

const photosFromState = [
  {
    _id: 'f717eb4d94f07737b168d3dbb7002141',
    metadata: {
      datetime: '0001-01-01T00:00:00Z'
    },
    name: 'MonPrecedentImage.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  }
]

describe('Photos reducer', () => {
  // if nothing is sent to the reducer, it should return an default state
  it('should return the default state when no arguments', () => {
    expect(
      photos(undefined, {})
    ).toEqual([])
  })

  // if RECEIVE_PHOTOS -> fetched photos
  it('should handle RECEIVE_PHOTOS', () => {
    expect(
      photos([], {
        type: RECEIVE_PHOTOS,
        photos: mockFetchedPhotos
      })
    ).toEqual(mockFetchedPhotos)
  })

  // if UPLOAD_PHOTOS_SUCCESS with no photos from state -> new photos
  it('should handle UPLOAD_PHOTOS_SUCCESS', () => {
    expect(
      photos([], {
        type: UPLOAD_PHOTOS_SUCCESS,
        photos: mockUploadedPhoto
      })
    ).toEqual(mockUploadedPhoto)
  })

  // if UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS with no photos from state -> new photos
  it('should handle UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS', () => {
    expect(
      photos([], {
        type: UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
        photos: mockUploadedPhoto
      })
    ).toEqual(mockUploadedPhoto)
  })

  // if UPLOAD_PHOTOS_FAILURE with no photos from state -> new photos
  it('should handle UPLOAD_PHOTOS_FAILURE', () => {
    expect(
      photos([], {
        type: UPLOAD_PHOTOS_FAILURE,
        photos: mockUploadedPhoto
      })
    ).toEqual(mockUploadedPhoto)
  })

  // if UPLOAD_PHOTOS_SUCCESS with photos from state -> new and previous photos
  it('should handle UPLOAD_PHOTOS_SUCCESS', () => {
    expect(
      photos(photosFromState, {
        type: UPLOAD_PHOTOS_SUCCESS,
        photos: mockUploadedPhoto
      })
    ).toEqual([...mockUploadedPhoto.reverse(), ...photosFromState])
  })

  // if UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS with photos from state -> new and previous photos
  it('should handle UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS', () => {
    expect(
      photos(photosFromState, {
        type: UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
        photos: mockUploadedPhoto
      })
    ).toEqual([...mockUploadedPhoto.reverse(), ...photosFromState])
  })

  // if UPLOAD_PHOTOS_FAILURE with photos from state -> new and previous photos
  it('should handle UPLOAD_PHOTOS_FAILURE', () => {
    expect(
      photos(photosFromState, {
        type: UPLOAD_PHOTOS_FAILURE,
        photos: mockUploadedPhoto
      })
    ).toEqual([...mockUploadedPhoto.reverse(), ...photosFromState])
  })
})
