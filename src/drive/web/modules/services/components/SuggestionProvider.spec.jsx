import React from 'react'
import { render, waitFor } from '@testing-library/react'
import SuggestionProvider from './SuggestionProvider'
import { dummyFile, dummyNote } from 'test/dummies/dummyFile'

const makeFileWithDoc = file => ({ ...file, doc: file })
const parentFolder = makeFileWithDoc(dummyFile({ _id: 'id-file' }))
const folder = makeFileWithDoc(dummyFile({ dir_id: 'id-file' }))
const note = makeFileWithDoc(
  dummyNote({
    dir_id: 'id-file',
    name: 'name.cozy-note'
  })
)
const mockClient = {
  fetchJSON: jest.fn().mockReturnValue({ rows: [parentFolder, folder, note] })
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
    window.cozy.client = mockClient
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
    expect(mockClient.fetchJSON).toHaveBeenCalledWith(
      'GET',
      '/data/io.cozy.files/_all_docs?Fields=_id,trashed,dir_id,name,path,type,mime,metadata.title,metadata.version&DesignDocs=false'
    )
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
              onSelect: 'open:http://localhost/#/folder/id-file',
              subtitle: '/path',
              term: 'name',
              title: 'name'
            },
            {
              icon: 'iconUrl',
              id: 'id-file',
              onSelect: 'id_note:id-file',
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
