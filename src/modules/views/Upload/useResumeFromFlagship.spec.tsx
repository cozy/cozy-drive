import { render, waitFor } from '@testing-library/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { WebviewService } from 'cozy-intent'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'

import { getProcessed, getSuccessful } from '@/modules/upload'
import { useResumeUploadFromFlagship } from '@/modules/views/Upload/useResumeFromFlagship'

global.jasmine = {
  // @ts-expect-error - Test will fail if this is not set
  testPath: ''
}

const mockUseDispatch = useDispatch as jest.Mock
const mockGetProcessed = getProcessed as jest.Mock
const mockGetSuccessful = getSuccessful as jest.Mock
const mockUseSelector = useSelector as jest.Mock
const mockUseAlert = useAlert as jest.Mock

const showAlert = jest.fn()

jest.mock('cozy-ui/transpiled/react/hooks/useBrowserOffline')
jest.mock('cozy-ui/transpiled/react/providers/Alert', () => ({
  ...jest.requireActual('cozy-ui/transpiled/react/providers/Alert'),
  __esModule: true,
  useAlert: jest.fn()
}))

jest.mock('cozy-intent', () => ({
  useWebviewIntent: (): Partial<WebviewService> => ({
    call: () =>
      Promise.resolve({
        filesToHandle: [{ name: 'testFile' }]
      }) as unknown as Promise<boolean>
  })
}))

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  createSelectorHook: jest.fn()
}))

jest.mock('modules/upload', () => ({
  getUploadQueue: jest.fn(),
  ADD_TO_UPLOAD_QUEUE: 'ADD_TO_UPLOAD_QUEUE',
  getProcessed: jest.fn(),
  getSuccessful: jest.fn()
}))

const TestComponent = (): JSX.Element => {
  useResumeUploadFromFlagship()

  return <div>Test</div>
}

describe('useResumeUploadFromFlagship', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDispatch.mockReturnValue(mockDispatch)
    mockUseAlert.mockReturnValue({ showAlert })
  })

  it('should not resume if there is no webview intent', () => {
    mockGetProcessed.mockReturnValue([])
    mockUseSelector.mockReturnValue([])
    mockGetSuccessful.mockReturnValue([])

    render(<TestComponent />)

    expect(showAlert).not.toHaveBeenCalled()
  })

  it('should not attempt to resume uploads if uploadQueue already has items on initialization', () => {
    mockGetProcessed.mockReturnValue([])
    mockGetSuccessful.mockReturnValue([])
    mockUseSelector.mockReturnValue([{ name: 'testFile' }])

    render(<TestComponent />)

    expect(mockDispatch).not.toHaveBeenCalledWith({
      type: 'ADD_TO_UPLOAD_QUEUE',
      files: ''
    })
  })

  it('should dispatch files to the upload queue when webviewIntent returns files from hasFilesToHandle', async () => {
    mockGetProcessed.mockReturnValue([])
    mockUseSelector.mockReturnValue([])
    mockGetSuccessful.mockReturnValue([])

    render(<TestComponent />)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'ADD_TO_UPLOAD_QUEUE',
        files: [{ name: 'testFile' }]
      })
    })
  })

  it('should not call the alert if upload is not finished', async () => {
    mockGetProcessed.mockReturnValue([])
    mockGetSuccessful.mockReturnValue([])
    mockUseSelector.mockReturnValue([{ name: 'testFile' }])

    render(<TestComponent />)

    await waitFor(() => {
      expect(showAlert).not.toHaveBeenCalled()
    })
  })

  it('should not perform any action if webviewIntent returns an error stating "has not been implemented"', async () => {
    mockGetProcessed.mockReturnValue([])
    mockUseSelector.mockReturnValue([])
    mockGetSuccessful.mockReturnValue([])
    const mockError = new Error('has not been implemented')
    jest.mock('cozy-intent', () => ({
      useWebviewIntent: (): Partial<WebviewService> => ({
        call: () => Promise.reject(mockError)
      })
    }))

    render(<TestComponent />)

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })
})
