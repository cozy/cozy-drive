import { createStore } from 'redux'
import { connectStoreToHistory, createReducer } from './connectedRouter'
import { hashHistory as history } from 'react-router'

const routes = [
  '/files/:folderId',
  '/folder/:folderId',
  '/files/:folderId/file/:fileId',
  '/folder/:folderId/file/:fileId',
  '/sharings/files/:fileId',
  '/sharings/:folderId'
]

describe('connectedRouter', () => {
  it('should extract params from actions', () => {
    const reducer = createReducer({
      routes
    })
    const store = createStore(reducer)
    connectStoreToHistory(store, history)

    expect(store.getState()).toEqual(
      expect.objectContaining({
        location: expect.objectContaining({
          pathname: '/'
        })
      })
    )

    history.push('/folder/12345')

    const state2 = store.getState()
    expect(state2.params.folderId).toEqual('12345')

    history.push({
      pathname: '/folder/12345/file/67890'
    })

    const state3 = store.getState()
    expect(state3.params.folderId).toEqual('12345')
    expect(state3.params.fileId).toEqual('67890')

    history.push({
      pathname: '/recents'
    })
    const state4 = store.getState()
    expect(Object.keys(state4.params).length).toBe(0)

    history.push({
      pathname: '/sharings/12345'
    })

    const state5 = store.getState()
    expect(state5.params.folderId).toEqual('12345')

    history.push({
      pathname: '/sharings/files/67890'
    })

    const state6 = store.getState()
    expect(state6.params.fileId).toEqual('67890')
    expect(state6.params.folderId).toBeFalsy()
  })
})
