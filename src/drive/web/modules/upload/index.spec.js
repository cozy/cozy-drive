import { processNextFile } from './index'

describe('processNextFile function', () => {
  const fileUploadedCallbackSpy = jest.fn()
  const queueCompletedCallbackSpy = jest.fn()
  const dirId = 'my-dir'
  const dispatchSpy = jest.fn(x => x)
  const createFileSpy = jest.fn()
  const fakeClient = {
    collection: () => ({
      createFile: createFileSpy
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should handle an empty queue', async () => {
    const getState = () => ({
      upload: {
        queue: []
      }
    })
    const asyncProcess = processNextFile(
      fileUploadedCallbackSpy,
      queueCompletedCallbackSpy,
      dirId
    )
    const result = await asyncProcess(dispatchSpy, getState, {
      client: fakeClient
    })
    result(dispatchSpy, getState)
    expect(queueCompletedCallbackSpy).toHaveBeenCalledWith([], [], [], [], [])
  })

  it('should process files in the queue', async () => {
    const getState = () => ({
      upload: {
        queue: [
          {
            status: 'pending',
            file: 'my-doc.odt',
            entry: '',
            isDirectory: false
          }
        ]
      }
    })
    createFileSpy.mockResolvedValue({
      data: {
        file: 'my-doc.odt'
      }
    })
    const asyncProcess = processNextFile(
      fileUploadedCallbackSpy,
      queueCompletedCallbackSpy,
      dirId
    )
    await asyncProcess(dispatchSpy, getState, { client: fakeClient })
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPLOAD_FILE',
      file: 'my-doc.odt'
    })
    expect(createFileSpy).toHaveBeenCalledWith('my-doc.odt', {
      dirId: 'my-dir'
    })
  })

  it('should process a file in conflict', async () => {
    const getState = () => ({
      upload: {
        queue: [
          {
            status: 'pending',
            file: 'my-doc.odt',
            entry: '',
            isDirectory: false
          }
        ]
      }
    })
    createFileSpy.mockRejectedValue({
      status: 409,
      title: 'Conflict',
      detail: 'file already exists',
      source: {}
    })
    const asyncProcess = processNextFile(
      fileUploadedCallbackSpy,
      queueCompletedCallbackSpy,
      dirId
    )
    await asyncProcess(dispatchSpy, getState, { client: fakeClient })

    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'UPLOAD_FILE',
      file: 'my-doc.odt'
    })
    expect(createFileSpy).toHaveBeenCalledWith('my-doc.odt', {
      dirId: 'my-dir'
    })
    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'RECEIVE_UPLOAD_ERROR',
      file: 'my-doc.odt',
      status: 'conflict'
    })
  })
})
