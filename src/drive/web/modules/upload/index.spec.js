import { processNextFile, selectors } from './index'
import flag from 'cozy-flags'

jest.mock('cozy-flags')

describe('processNextFile function', () => {
  const fileUploadedCallbackSpy = jest.fn()
  const queueCompletedCallbackSpy = jest.fn()
  const dirId = 'my-dir'
  const dispatchSpy = jest.fn(x => x)
  const createFileSpy = jest.fn()
  const getSpy = jest.fn()
  const statByPathSpy = jest.fn()
  const updateFileSpy = jest.fn()
  const fakeClient = {
    collection: () => ({
      createFile: createFileSpy,
      get: getSpy,
      statByPath: statByPathSpy,
      updateFile: updateFileSpy
    })
  }
  const file = new File(['foo'], 'my-doc.odt')
  const sharingState = {
    sharedPaths: []
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    flag.mockReturnValue(true)
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
      dirId,
      sharingState
    )
    const result = await asyncProcess(dispatchSpy, getState, {
      client: fakeClient
    })
    result(dispatchSpy, getState)
    expect(queueCompletedCallbackSpy).toHaveBeenCalledWith(
      [],
      [],
      [],
      [],
      [],
      []
    )
  })

  it('should process files in the queue', async () => {
    const getState = () => ({
      upload: {
        queue: [
          {
            status: 'pending',
            file,
            entry: '',
            isDirectory: false
          }
        ]
      }
    })
    createFileSpy.mockResolvedValue({
      data: {
        file
      }
    })
    const asyncProcess = processNextFile(
      fileUploadedCallbackSpy,
      queueCompletedCallbackSpy,
      dirId,
      sharingState
    )
    await asyncProcess(dispatchSpy, getState, { client: fakeClient })
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'UPLOAD_FILE',
      file
    })
    expect(createFileSpy).toHaveBeenCalledWith(file, {
      dirId: 'my-dir'
    })
  })

  it('should process a file in conflict', async () => {
    const getState = () => ({
      upload: {
        queue: [
          {
            status: 'pending',
            file,
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

    getSpy.mockResolvedValue({
      data: {
        path: '/my-dir'
      }
    })

    statByPathSpy.mockResolvedValue({
      data: {
        dir_id: 'my-dir',
        id: 'b552a167-1aa4'
      }
    })

    updateFileSpy.mockResolvedValue({ data: file })

    const asyncProcess = processNextFile(
      fileUploadedCallbackSpy,
      queueCompletedCallbackSpy,
      dirId,
      sharingState
    )
    await asyncProcess(dispatchSpy, getState, { client: fakeClient })

    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'UPLOAD_FILE',
      file
    })
    expect(createFileSpy).toHaveBeenCalledWith(file, {
      dirId: 'my-dir'
    })

    expect(updateFileSpy).toHaveBeenCalledWith(file, {
      dirId: 'my-dir',
      fileId: 'b552a167-1aa4'
    })

    expect(fileUploadedCallbackSpy).toHaveBeenCalledWith(file)

    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      type: 'RECEIVE_UPLOAD_SUCCESS',
      file,
      isUpdate: true
    })
  })

  it('should not update a file in conflict if it is shared', async () => {
    const getState = () => ({
      upload: {
        queue: [
          {
            status: 'pending',
            file,
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

    getSpy.mockResolvedValue({
      data: {
        path: '/my-dir'
      }
    })

    statByPathSpy.mockResolvedValue({
      data: {
        dir_id: 'my-dir',
        id: 'b552a167-1aa4'
      }
    })

    updateFileSpy.mockResolvedValue({ data: file })

    const sharingState = {
      sharedPaths: ['/my-dir']
    }

    const asyncProcess = processNextFile(
      fileUploadedCallbackSpy,
      queueCompletedCallbackSpy,
      dirId,
      sharingState
    )
    await asyncProcess(dispatchSpy, getState, { client: fakeClient })

    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'UPLOAD_FILE',
      file
    })
    expect(createFileSpy).toHaveBeenCalledWith(file, {
      dirId: 'my-dir'
    })

    expect(fileUploadedCallbackSpy).not.toHaveBeenCalled()

    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      file,
      status: 'conflict',
      type: 'RECEIVE_UPLOAD_ERROR'
    })
  })

  it('should handle an error during overwrite', async () => {
    const getState = () => ({
      upload: {
        queue: [
          {
            status: 'pending',
            file,
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

    getSpy.mockResolvedValue({
      data: {
        path: '/my-dir'
      }
    })

    statByPathSpy.mockResolvedValue({
      data: {
        id: 'b552a167-1aa4'
      }
    })

    updateFileSpy.mockRejectedValue({ status: 413 })

    const asyncProcess = processNextFile(
      fileUploadedCallbackSpy,
      queueCompletedCallbackSpy,
      dirId,
      sharingState
    )
    await asyncProcess(dispatchSpy, getState, { client: fakeClient })

    expect(fileUploadedCallbackSpy).not.toHaveBeenCalled()

    expect(dispatchSpy).toHaveBeenNthCalledWith(2, {
      file,
      status: 'quota',
      type: 'RECEIVE_UPLOAD_ERROR'
    })
  })
})

describe('selectors', () => {
  const queue = [
    { status: 'created' },
    { status: 'updated' },
    { status: 'conflict' },
    { status: 'failed' },
    { status: 'quota' },
    { status: 'network' },
    { status: 'pending' }
  ]

  describe('getCreated selector', () => {
    it('should return all uploaded items', () => {
      const result = selectors.getCreated(queue)
      expect(result).toEqual([
        {
          status: 'created'
        }
      ])
    })
  })

  describe('getUpdated selector', () => {
    it('should return all updated items', () => {
      const result = selectors.getUpdated(queue)
      expect(result).toEqual([
        {
          status: 'updated'
        }
      ])
    })
  })

  describe('getSuccessful selector', () => {
    it('should return all successful items', () => {
      const queue = [
        { id: '1', status: 'created' },
        { id: '2', status: 'quota' },
        { id: '3', status: 'conflict' },
        { id: '4', status: 'updated' },
        { id: '5', status: 'failed' },
        { id: '6', status: 'updated' }
      ]
      const state = {
        upload: {
          queue
        }
      }
      const result = selectors.getSuccessful(state)
      expect(result).toEqual([
        { id: '1', status: 'created' },
        { id: '4', status: 'updated' },
        { id: '6', status: 'updated' }
      ])
    })
  })
})
