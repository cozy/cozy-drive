import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import LightFileViewer from './LightFileViewer'
import AppLike from 'test/components/AppLike'

jest.mock('cozy-intent', () => ({
  WebviewIntentProvider: ({ children }) => children,
  useWebviewIntent: () => ({ call: () => {} })
}))
jest.mock('cozy-ui/transpiled/react/providers/Breakpoints', () => ({
  __esModule: true,
  default: jest.fn(),
  BreakpointsProvider: ({ children }) => children
}))

const client = new createMockClient({})

const setup = () => {
  const root = render(
    <AppLike client={client}>
      <LightFileViewer files={[{ id: '01', name: 'fileName' }]} />
    </AppLike>
  )

  return { root }
}

describe('LightFileViewer', () => {
  describe('on Mobile and Tablet', () => {
    beforeAll(() => {
      useBreakpoints.mockReturnValue({ isDesktop: false })
    })

    it('should have the sharing banner and public toolbar but no viewer toolbar', () => {
      jest.spyOn(console, 'error').mockImplementation() // TODO: to be removed with https://github.com/cozy/cozy-libs/pull/1457

      const { root } = setup()
      const { queryByTestId, queryAllByRole } = root

      expect(queryAllByRole('link')[0].getAttribute('href')).toBe(
        'https://cozy.io'
      ) // This is the sharing banner
      expect(queryByTestId('public-toolbar')).toBeTruthy()
      expect(queryByTestId('viewer-toolbar')).toBeFalsy()
    })
  })

  describe('on Desktop', () => {
    beforeAll(() => {
      useBreakpoints.mockReturnValue({ isDesktop: true })
    })

    it('should have the sharing banner and viewer toolbar but no public toolbar', () => {
      const { root } = setup()
      const { container, queryByTestId, queryAllByRole } = root

      expect(queryAllByRole('link')[0].getAttribute('href')).toBe(
        'https://cozy.io'
      ) // This is the sharing banner
      expect(queryByTestId('public-toolbar')).toBeFalsy()
      expect(
        container.querySelector('[data-testid="viewer-toolbar"]')
      ).toBeTruthy()
    })
  })
})
