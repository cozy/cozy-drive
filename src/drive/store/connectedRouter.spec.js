import { locationChanged, createReducer } from './connectedRouter'

const routes = [
  '/folder/:folderId/file/:fileId',
  '/files/:folderId/file/:fileId',
  '/files/:folderId',
  '/folder/:folderId'
]

describe('connectedRouter', () => {
  it('should extract params from actions', () => {
    const reducer = createReducer({
      routes
    })
    const state = reducer()
    expect(state).toEqual({})
    const state2 = reducer(
      state,
      locationChanged({
        pathname: '/folder/12345'
      })
    )
    expect(state2.params.folderId).toEqual('12345')
    const state3 = reducer(
      state2,
      locationChanged({
        pathname: '/folder/12345/file/67890'
      })
    )
    expect(state3.params.folderId).toEqual('12345')
    expect(state3.params.fileId).toEqual('67890')
  })
})
