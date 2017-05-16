/* global describe it expect */

import {
  getPhotosByMonth
} from '../../src/lib/helpers'

const mockPhotos = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac8',
    metadata: {
      datetime: '0001-01-01T00:00:00Z'
    },
    name: 'MonImage_january.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac9',
    metadata: {
      datetime: '0001-01-10T00:00:00Z'
    },
    name: 'MonImage_january.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  },
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac0',
    metadata: {
      datetime: '0001-02-01T00:00:00Z'
    },
    name: 'MonImage2_february.jpg',
    size: '100000',
    updated_at: '0001-01-01T00:00:00Z'
  }
]

const mockExpected = [
  {
    title: '0001-01-01T00:00',
    photos: [
      {
        _id: '33dda00f0eec15bc3b3c59a615001ac8',
        metadata: {
          datetime: '0001-01-01T00:00:00Z'
        },
        name: 'MonImage_january.jpg',
        size: '150000',
        updated_at: '0001-01-01T00:00:00Z'
      },
      {
        _id: '33dda00f0eec15bc3b3c59a615001ac9',
        metadata: {
          datetime: '0001-01-10T00:00:00Z'
        },
        name: 'MonImage_january.jpg',
        size: '150000',
        updated_at: '0001-01-01T00:00:00Z'
      }
    ]
  },
  {
    title: '0001-02-01T00:00',
    photos: [
      {
        _id: '33dda00f0eec15bc3b3c59a615001ac0',
        metadata: {
          datetime: '0001-02-01T00:00:00Z'
        },
        name: 'MonImage2_february.jpg',
        size: '100000',
        updated_at: '0001-01-01T00:00:00Z'
      }
    ]
  }
]

describe('getPhotosByMonth helper', () => {
  it('should return array of category with sorted photos and a title for each category', () => {
    expect(
      getPhotosByMonth(mockPhotos)
    ).toEqual(mockExpected)
  })
})
