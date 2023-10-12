import { getReferencedBy } from 'cozy-client'
import log from 'cozy-logger'

import { onPhotoTrashed } from 'photos/lib/onPhotoTrashed'

jest.mock('cozy-logger')
jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  getReferencedBy: jest.fn()
}))

describe('onPhotoTrashed', () => {
  beforeEach(() => {
    getReferencedBy.mockReturnValue([])
  })

  it('should not remove album references if there are no trashed photos', async () => {
    const removeSpy = jest.fn()
    const mockClient = {
      queryAll: () => [],
      collection: () => ({ removeReferencedBy: removeSpy })
    }

    await onPhotoTrashed(mockClient)

    expect(removeSpy).toHaveBeenCalledTimes(0)
    expect(log).toBeCalledTimes(0)
  })

  it('should remove album references from trashed photos', async () => {
    const removeSpy = jest.fn()
    const mockClient = {
      queryAll: () => [
        {
          _id: 'photo_1'
        },
        {
          _id: 'photo_2'
        }
      ],
      collection: () => ({ removeReferencedBy: removeSpy })
    }
    getReferencedBy
      .mockReturnValueOnce([
        {
          id: '123',
          type: 'albums'
        },
        {
          id: '456',
          type: 'albums'
        }
      ])
      .mockReturnValueOnce([])

    await onPhotoTrashed(mockClient)

    expect(removeSpy).toBeCalledTimes(1)
    expect(removeSpy).toBeCalledWith({ _id: 'photo_1' }, [
      {
        _id: '123',
        _type: 'albums'
      },
      {
        _id: '456',
        _type: 'albums'
      }
    ])
  })

  it('should not remove album references if there are no references', async () => {
    const removeSpy = jest.fn()
    const mockClient = {
      queryAll: [
        {
          _id: 'photo_1'
        }
      ],
      collection: () => ({ removeReferencedBy: removeSpy })
    }

    await onPhotoTrashed(mockClient)

    expect(removeSpy).toHaveBeenCalledTimes(0)
  })

  it('should handle errors when removing album references', async () => {
    const error = new Error('Failed to remove album references')
    const removeSpy = jest.fn(() => {
      throw new Error('Failed to remove album references')
    })
    const mockClient = {
      queryAll: () => [
        {
          _id: 'photo_1'
        }
      ],
      collection: () => ({ removeReferencedBy: removeSpy })
    }
    getReferencedBy.mockReturnValue([
      {
        id: '123',
        type: 'albums'
      }
    ])

    await onPhotoTrashed(mockClient)

    expect(removeSpy).toBeCalledWith({ _id: 'photo_1' }, [
      {
        _id: '123',
        _type: 'albums'
      }
    ])
    expect(log).toHaveBeenLastCalledWith('error', error)
  })
})
