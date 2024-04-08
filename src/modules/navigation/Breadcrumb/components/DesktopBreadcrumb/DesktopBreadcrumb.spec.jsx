import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'

import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { dummyBreadcrumbPath } from 'test/dummies/dummyBreadcrumbPath'

import DesktopBreadcrumb from './DesktopBreadcrumb'

jest.mock('cozy-ui/transpiled/react/deprecated/ActionMenu', () => ({
  __esModule: true,
  // eslint-disable-next-line react/display-name
  default: ({ children }) => <div data-testid="action-menu">{children}</div>,
  // eslint-disable-next-line react/display-name
  ActionMenuItem: ({ children }) => (
    <div data-testid="action-menu-item">{children}</div>
  )
}))

jest.mock('cozy-ui/transpiled/react/providers/I18n')
describe('DesktopBreadcrumb', () => {
  beforeEach(() => {
    useI18n.mockReturnValue({ t: () => 'Show path' })
  })

  describe('template', () => {
    it('should display breadcrumb from material ui - with root + only parent - on desktop', () => {
      // When
      const { container, queryByText } = render(
        <DesktopBreadcrumb path={dummyBreadcrumbPath()} />
      )

      // Then
      expect(queryByText('Drive')).toBeTruthy()
      expect(queryByText('current')).toBeTruthy()
      expect(queryByText('parent')).toBeTruthy()
      expect(queryByText('grandparent')).toBeFalsy()
      expect(
        container.querySelector('[aria-label]').getAttribute('aria-label')
      ).toEqual('Show path')
      expect(container.querySelector('.fil-path-separator')).toBeTruthy()
    })

    it('should have convenient style on Public view - on desktop', () => {
      // When
      const { container } = render(
        <DesktopBreadcrumb path={dummyBreadcrumbPath()} />
      )

      // Then
      expect(container.querySelector('.fil-path-backdrop')).toBeTruthy()
    })
  })

  describe('mount', () => {
    it('should hide menu displayed while navigating', async () => {
      // Given
      const { container, queryByTestId, rerender } = await render(
        <DesktopBreadcrumb path={dummyBreadcrumbPath()} />
      )
      act(() => {
        container.querySelector('[aria-label]').click()
      })
      expect(queryByTestId('action-menu')).toBeInTheDocument()

      // When
      rerender(<DesktopBreadcrumb path={dummyBreadcrumbPath()} />)

      // Then
      expect(queryByTestId('action-menu')).not.toBeInTheDocument()
    })

    it('should update dropdown trigger while navigating - on public page', async () => {
      // Given
      const { container, rerender } = await render(
        <DesktopBreadcrumb path={[]} />
      )

      expect(container.querySelector('[aria-label]')).toBeNull()

      rerender(<DesktopBreadcrumb path={dummyBreadcrumbPath()} />)

      // When
      act(() => {
        container.querySelector('[aria-label]').click()
      })

      // Then
      expect(container.querySelector('[aria-label]')).not.toBeNull()
    })
  })

  describe('events', () => {
    it('should dispatch on breadcrumb click - on desktop', () => {
      // Given
      const onBreadcrumbClick = jest.fn()
      const path = dummyBreadcrumbPath()

      const { queryByText } = render(
        <DesktopBreadcrumb path={path} onBreadcrumbClick={onBreadcrumbClick} />
      )

      // When
      queryByText('Drive').click()

      // Then
      expect(onBreadcrumbClick).toHaveBeenCalledWith(path[0])
    })

    it('should display action menu on click on "..." on desktop', () => {
      // Given
      const path = dummyBreadcrumbPath()

      const { container, queryByTestId } = render(
        <BreakpointsProvider>
          <DesktopBreadcrumb path={path} />
        </BreakpointsProvider>
      )

      // When
      act(() => {
        container.querySelector('[aria-label]').click()
      })

      // Then
      expect(queryByTestId('action-menu')).toBeInTheDocument()
      expect(queryByTestId('action-menu-item')).toBeInTheDocument()
    })

    it('should add grandParents only in dropdown - on click on ... on desktop', () => {
      // Given
      const path = dummyBreadcrumbPath()

      const { container, queryByText } = render(
        <BreakpointsProvider>
          <DesktopBreadcrumb path={path} />
        </BreakpointsProvider>
      )

      // When
      act(() => {
        container.querySelector('[aria-label]').click()
      })

      // Then
      expect(container.querySelectorAll('.MuiBreadcrumbs-li')[1]).not.toEqual(
        'grandParents'
      )
      expect(queryByText('grandParent')).toBeInTheDocument()
    })

    it('should handle on click outside on desktop - removing dropdown', () => {
      // Given
      const path = dummyBreadcrumbPath()

      const { container, queryByText } = render(
        <div>
          <button onClick={jest.fn()} />
          <DesktopBreadcrumb path={path} />
        </div>
      )

      // When
      fireEvent.click(container.querySelector('button'))

      // Then
      expect(queryByText('grandParent')).not.toBeInTheDocument()
      expect(container.querySelector('.dropdown')).not.toBeInTheDocument()
    })
  })
})
