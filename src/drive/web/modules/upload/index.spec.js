import {
  processNextFile,
  selectors,
  queue,
  getFileFullpath,
  overwriteFile
} from './index'
import flag from 'cozy-flags'

jest.mock('cozy-flags')

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

describe('processNextFile function', () => {
  const fileUploadedCallbackSpy = jest.fn()
  const queueCompletedCallbackSpy = jest.fn()
  const dirId = 'my-dir'
  const dispatchSpy = jest.fn(x => x)
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

describe('queue reducer', () => {
  const state = [
    {
      status: 'pending',
      file: {
        name: 'doc1.odt'
      }
    },
    {
      status: 'pending',
      file: {
        name: 'doc2.odt'
      }
    },
    {
      status: 'pending',
      file: {
        name: 'doc3.odt'
      }
    }
  ]
  it('should be empty (initial state)', () => {
    const result = queue(undefined, {})
    expect(result).toEqual([])
  })

  it('should handle PURGE_UPLOAD_QUEUE action type', () => {
    const action = {
      type: 'PURGE_UPLOAD_QUEUE'
    }
    const state = [{ status: 'created', id: '1' }]
    const result = queue(state, action)
    expect(result).toEqual([])
  })

  it('should handle UPLOAD_FILE action type', () => {
    const action = {
      type: 'UPLOAD_FILE',
      file: {
        name: 'doc1.odt'
      }
    }
    const expected = [
      {
        status: 'loading',
        file: {
          name: 'doc1.odt'
        }
      },
      {
        status: 'pending',
        file: {
          name: 'doc2.odt'
        }
      },
      {
        status: 'pending',
        file: {
          name: 'doc3.odt'
        }
      }
    ]
    const result = queue(state, action)
    expect(result).toEqual(expected)
  })

  it('should handle RECEIVE_UPLOAD_SUCCESS action type', () => {
    const action = {
      type: 'RECEIVE_UPLOAD_SUCCESS',
      file: {
        name: 'doc3.odt'
      }
    }
    const expected = [
      {
        status: 'pending',
        file: {
          name: 'doc1.odt'
        }
      },
      {
        status: 'pending',
        file: {
          name: 'doc2.odt'
        }
      },
      {
        status: 'created',
        file: {
          name: 'doc3.odt'
        }
      }
    ]
    const result = queue(state, action)
    expect(result).toEqual(expected)
  })

  it('should handle RECEIVE_UPLOAD_SUCCESS action type (update)', () => {
    const action = {
      type: 'RECEIVE_UPLOAD_SUCCESS',
      file: {
        name: 'doc3.odt'
      },
      isUpdate: true
    }
    const expected = [
      {
        status: 'pending',
        file: {
          name: 'doc1.odt'
        }
      },
      {
        status: 'pending',
        file: {
          name: 'doc2.odt'
        }
      },
      {
        status: 'updated',
        file: {
          name: 'doc3.odt'
        }
      }
    ]
    const result = queue(state, action)
    expect(result).toEqual(expected)
  })

  it('should handle RECEIVE_UPLOAD_ERROR action type', () => {
    const action = {
      type: 'RECEIVE_UPLOAD_ERROR',
      file: {
        name: 'doc2.odt'
      },
      status: 'conflict'
    }
    const expected = [
      {
        status: 'pending',
        file: {
          name: 'doc1.odt'
        }
      },
      {
        status: 'conflict',
        file: {
          name: 'doc2.odt'
        }
      },
      {
        status: 'pending',
        file: {
          name: 'doc3.odt'
        }
      }
    ]
    const result = queue(state, action)
    expect(result).toEqual(expected)
  })
})

describe('getFileFullpath function', () => {
  const getSpy = jest.fn()
  const fakeClient = {
    collection: () => ({
      get: getSpy
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return the full path of the file', async () => {
    getSpy.mockResolvedValue({
      data: {
        path: '/GrandParent/Parent'
      }
    })
    const file = new File([''], 'mydoc.odt')
    const result = await getFileFullpath(fakeClient, file, 'parent')
    expect(result).toEqual('/GrandParent/Parent/mydoc.odt')
  })

  it('should return the full path of a file in root directory', async () => {
    getSpy.mockResolvedValue({
      data: {
        path: '/'
      }
    })
    const file = new File([''], 'mydoc.odt')
    const result = await getFileFullpath(fakeClient, file, 'parent')
    expect(result).toEqual('/mydoc.odt')
  })
})

describe('overwriteFile function', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should update the io.cozy.files', async () => {
    updateFileSpy.mockResolvedValue({
      data: {
        id: 'b7cb22be72d2',
        type: 'io.cozy.files',
        attributes: {
          type: 'file',
          name: 'mydoc.odt'
        }
      }
    })
    statByPathSpy.mockResolvedValue({
      data: {
        id: 'b7cb22be72d2',
        dir_id: '972bc693-f015'
      }
    })
    const file = new File([''], 'mydoc.odt')
    const result = await overwriteFile(fakeClient, file, '/parent/mydoc.odt')
    expect(updateFileSpy).toHaveBeenCalledWith(file, {
      dirId: '972bc693-f015',
      fileId: 'b7cb22be72d2'
    })
    expect(result).toEqual({
      id: 'b7cb22be72d2',
      type: 'io.cozy.files',
      attributes: {
        type: 'file',
        name: 'mydoc.odt'
      }
    })
  })
})
