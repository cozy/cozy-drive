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

    realtimeCallbacks['created']({ id: 'mock-created', type: 'file' })
    expect(client.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        definition: {
          document: { id: 'mock-created', type: 'file' },
          mutationType: 'CREATE_DOCUMENT'
        },
        response: {
          data: {
            _type: 'io.cozy.files',
            type: 'file',
            id: 'mock-created',
            _id: 'mock-created'
          }
        },
        type: 'RECEIVE_MUTATION_RESULT'
      })
    )

    realtimeCallbacks['updated']({ id: 'mock-updated', type: 'file' })
    expect(client.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        definition: {
          document: { id: 'mock-updated', type: 'file' },
          mutationType: 'UPDATE_DOCUMENT'
        },
        response: {
          data: {
            _type: 'io.cozy.files',
            type: 'file',
            id: 'mock-updated',
            _id: 'mock-updated'
          }
        },
        type: 'RECEIVE_MUTATION_RESULT'
      })
    )

    realtimeCallbacks['deleted']({ id: 'mock-deleted', type: 'file' })
    expect(client.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        definition: {
          document: { id: 'mock-deleted', type: 'file', _deleted: true },
          mutationType: 'DELETE_DOCUMENT'
        },
        response: {
          data: {
            _deleted: true,
            _type: 'io.cozy.files',
            type: 'file',
            id: 'mock-deleted',
            _id: 'mock-deleted'
          }
        },
        type: 'RECEIVE_MUTATION_RESULT'
      })
    )

    unmount()
    expect(client.plugins.realtime.unsubscribe).toHaveBeenCalledTimes(3)
  })
})
