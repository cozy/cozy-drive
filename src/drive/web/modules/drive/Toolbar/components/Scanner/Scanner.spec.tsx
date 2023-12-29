import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { useWebviewIntent } from 'cozy-intent'
import { createMockClient } from 'cozy-client'

import { ScannerProvider } from 'drive/web/modules/drive/Toolbar/components/Scanner/ScannerProvider'
import { ScannerMenuItem } from 'drive/web/modules/drive/Toolbar/components/Scanner/ScannerMenuItem'

// @ts-expect-error Component is not typed
import AppLike from 'test/components/AppLike'

// @ts-expect-error Don't care about the mocked client here
const client = createMockClient({})

const MockApp = ({ id = 'test' }): JSX.Element => (
  <AppLike client={client}>
    <ScannerProvider displayedFolder={{ id }}>
      <ScannerMenuItem />
    </ScannerProvider>
  </AppLike>
)

jest.mock('cozy-device-helper', () => ({
  ...jest.requireActual('cozy-device-helper'),
  isFlagshipApp: (): boolean => true
}))

const mockUseWebviewIntent = useWebviewIntent as jest.Mock
jest.mock('cozy-intent', () => ({
  useWebviewIntent: jest.fn()
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: (): jest.Mock => mockDispatch() as jest.Mock
}))

jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

describe('Scanner', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders nothing if the scanner is not available', () => {
    mockUseWebviewIntent.mockReturnValue({
      call: jest.fn().mockResolvedValue(false)
    })
    const { queryByTestId } = render(<MockApp />)

    expect(queryByTestId('scan-doc')).toBeNull()
  })

  it('renders an ActionMenuItem if the folder is available', async () => {
    mockUseWebviewIntent.mockReturnValue({
      call: jest.fn((method, arg) => {
        if (method === 'isAvailable' && arg === 'scanner') {
          return Promise.resolve(true)
        }

        return Promise.resolve(false)
      })
    })

    const { queryByTestId } = render(<MockApp />)

    await waitFor(() => {
      expect(queryByTestId('scan-doc')).not.toBeNull()
    })
  })

  it('calls the startScanner function on click', async () => {
    mockUseWebviewIntent.mockReturnValue({
      call: jest.fn((method, arg) => {
        if (method === 'isAvailable' && arg === 'scanner') {
          return Promise.resolve(true)
        }

        if (method === 'scanDocument') {
          return Promise.resolve('base64jpeg')
        }

        return Promise.resolve(false)
      })
    })

    const { queryByTestId } = render(<MockApp />)

    await waitFor(() => {
      queryByTestId('scan-doc') as HTMLButtonElement
    })

    fireEvent.click(queryByTestId('scan-doc')?.firstChild as HTMLButtonElement)

    expect(mockDispatch).toHaveBeenCalled()
  })

  it('handles unexpected errors', async () => {
    mockUseWebviewIntent.mockReturnValue({
      call: jest.fn(() => {
        throw new Error('Unexpected error')
      })
    })

    const { queryByTestId } = render(<MockApp />)

    await waitFor(() => {
      expect(queryByTestId('scan-doc')).toBeNull()
    })
  })
})
