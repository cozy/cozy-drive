import React from 'react'
import { render, waitFor } from '@testing-library/react'
import RealTimeQueries from './RealTimeQueries'
import AppLike from 'test/components/AppLike'
import { createMockClient } from 'cozy-client'

describe('RealTimeQueries', () => {
  it('notifies the cozy-client store', async () => {
    const realtimeCallbacks = {}
    const client = new createMockClient({})
    client.plugins.realtime = {
      subscribe: jest.fn((event, doctype, callback) => {
        realtimeCallbacks[event] = callback
      }),
      unsubscribe: jest.fn()
    }
    client.dispatch = jest.fn()

    const { unmount } = render(
      <AppLike client={client}>
        <RealTimeQueries doctype="io.cozy.files" />
      </AppLike>
    )

    await waitFor(() =>
      expect(client.plugins.realtime.subscribe).toHaveBeenCalledTimes(3)
    )

    realtimeCallbacks['created']({ id: 'mock-created' })
    expect(client.dispatch).toHaveBeenCalledWith({
      definition: {
        document: { id: 'mock-created' },
        mutationType: 'CREATE_DOCUMENT'
      },
      mutationId: 1,
      response: { data: { _type: 'io.cozy.files', id: 'mock-created' } },
      type: 'RECEIVE_MUTATION_RESULT'
    })

    realtimeCallbacks['updated']({ id: 'mock-updated' })
    expect(client.dispatch).toHaveBeenCalledWith({
      definition: {
        document: { id: 'mock-updated' },
        mutationType: 'UPDATE_DOCUMENT'
      },
      mutationId: 2,
      response: { data: { _type: 'io.cozy.files', id: 'mock-updated' } },
      type: 'RECEIVE_MUTATION_RESULT'
    })

    realtimeCallbacks['deleted']({ id: 'mock-deleted' })
    expect(client.dispatch).toHaveBeenCalledWith({
      definition: {
        document: { id: 'mock-deleted', _deleted: true },
        mutationType: 'DELETE_DOCUMENT'
      },
      mutationId: 3,
      response: {
        data: { _deleted: true, _type: 'io.cozy.files', id: 'mock-deleted' }
      },
      type: 'RECEIVE_MUTATION_RESULT'
    })

    unmount()
    expect(client.plugins.realtime.unsubscribe).toHaveBeenCalledTimes(3)
  })
})
