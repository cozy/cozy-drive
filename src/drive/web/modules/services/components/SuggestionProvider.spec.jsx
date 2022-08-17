import React from 'react'
import { render, waitFor } from '@testing-library/react'
import SuggestionProvider from './SuggestionProvider'
import { dummyFile, dummyNote } from 'test/dummies/dummyFile'

const parentFolder = dummyFile({ _id: 'id-file' })
const folder = dummyFile({ dir_id: 'id-file' })
const note = dummyNote({
  dir_id: 'id-file',
  name: 'name.cozy-note'
})
const mockFindAll = jest.fn().mockReturnValue([parentFolder, folder, note])
const mockClient = {
  collection: jest.fn().mockReturnValue({ findAll: mockFindAll })
}
const mockIntentAttributesClient = 'intent-attributes-client'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  withClient: Component => () => {
    const intent = {
      _id: 'id_intent',
      attributes: { client: mockIntentAttributesClient }
    }
    return <Component client={mockClient} intent={intent}></Component>
  }
}))
jest.mock('./iconContext', () => ({ getIconUrl: () => 'iconUrl' }))

describe('SuggestionProvider', () => {
  let events = {}
  let event

  beforeEach(() => {
    window.addEventListener = jest.fn((event, callback) => {
      events[event] = callback
    })
    window.parent.postMessage = jest.fn()
    event = {
      origin: mockIntentAttributesClient,
      data: { query: 'name', id: 'id' }
    }
  })

  it('should query all files to display fuzzy suggestion', () => {
    // Given
    render(<SuggestionProvider />)

    // When
    events.message(event)

    // Then
    expect(mockClient.collection).toHaveBeenCalledWith('io.cozy.files')
    expect(mockFindAll).toHaveBeenCalledWith(null, {
      fields: ['_id', 'trashed', 'dir_id', 'name', 'path', 'type', 'mime'],
      indexedFields: ['_id'],
      limit: 1000,
      partialFilter: {
        _id: { $ne: 'io.cozy.files.trash-dir' },
        path: { $or: [{ $exists: false }, { $regex: '^(?!/.cozy_trash)' }] },
        trashed: { $or: [{ $exists: false }, { $eq: false }] }
      }
    })
  })

  it('should provide onSelect with open url when file is not a note + and function when it is a note', async () => {
    // Given
    render(<SuggestionProvider />)

    // When
    events.message(event)

    // Then
    await waitFor(() => {
      expect(window.parent.postMessage).toHaveBeenCalledWith(
        {
          id: 'id',
          suggestions: [
            {
              icon: 'iconUrl',
              id: 'id-file',
              onSelect: 'open:http://localhost/#/folder/id-file',
              subtitle: '/path',
              term: 'name',
              title: 'name'
            },
            {
              icon: 'iconUrl',
              id: 'id-file',
              onSelect: expect.any(Function),
              subtitle: '/path',
              term: 'name.cozy-note',
              title: 'name.cozy-note'
            }
          ],
          type: 'intent-id_intent:data'
        },
        'intent-attributes-client'
      )
    })
  })
})
