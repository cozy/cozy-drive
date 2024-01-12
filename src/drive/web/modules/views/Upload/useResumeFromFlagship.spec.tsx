import React from 'react'
import { render, waitFor } from '@testing-library/react'
import { useDispatch, useSelector } from 'react-redux'

import { useResumeUploadFromFlagship } from 'drive/web/modules/views/Upload/useResumeFromFlagship'
import { getProcessed, getSuccessful } from 'drive/web/modules/upload'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { WebviewService } from 'cozy-intent'

global.jasmine = {
  // @ts-expect-error - Test will fail if this is not set
  testPath: ''
}

const mockUseDispatch = useDispatch as jest.Mock
const mockGetProcessed = getProcessed as jest.Mock
const mockGetSuccessful = getSuccessful as jest.Mock
const mockUseSelector = useSelector as jest.Mock

jest.mock('cozy-ui/transpiled/react/deprecated/Alerter', () => ({
  success: jest.fn()
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

jest.mock('drive/web/modules/upload', () => ({
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
  })

  it('should not resume if there is no webview intent', () => {
    mockGetProcessed.mockReturnValue([])
    mockUseSelector.mockReturnValue([])
    mockGetSuccessful.mockReturnValue([])

    render(<TestComponent />)

    expect(Alerter.success).not.toHaveBeenCalled()
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

  it('should not call the alerter if upload is not finished', async () => {
    mockGetProcessed.mockReturnValue([])
    mockGetSuccessful.mockReturnValue([])
    mockUseSelector.mockReturnValue([{ name: 'testFile' }])

    render(<TestComponent />)

    await waitFor(() => {
      expect(Alerter.success).not.toHaveBeenCalled()
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
