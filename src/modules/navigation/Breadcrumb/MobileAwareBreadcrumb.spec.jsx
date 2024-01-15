import { render } from '@testing-library/react'
import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import MobileAwareBreadcrumb from './MobileAwareBreadcrumb'

jest.mock('cozy-ui/transpiled/react/providers/Breakpoints')
// eslint-disable-next-line react/display-name
jest.mock('./components/DesktopBreadcrumb/DesktopBreadcrumb', () => () => (
  <div data-testid="desktop-breadcrumb" />
))
// eslint-disable-next-line react/display-name
jest.mock('./components/MobileBreadcrumb/MobileBreadcrumb', () => () => (
  <div data-testid="mobile-breadcrumb" />
))

describe('MobileAwareBreadcrumb', () => {
  it('should return mobile breadcrumb on mobile', () => {
    // Given
    useBreakpoints.mockReturnValue({ isMobile: true })

    // When
    const { getByTestId } = render(<MobileAwareBreadcrumb />)

    // Then
    expect(getByTestId('mobile-breadcrumb')).toBeInTheDocument()
  })

  it('should return mobile breadcrumb on desktop', () => {
    // Given
    useBreakpoints.mockReturnValue({ isMobile: false })

    // When
    const { getByTestId } = render(<MobileAwareBreadcrumb />)

    // Then
    expect(getByTestId('desktop-breadcrumb')).toBeInTheDocument()
  })
})
