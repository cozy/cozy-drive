import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import MobileBreadcrumb from './MobileBreadcrumb'
import AppLike from 'test/components/AppLike'

jest.mock('cozy-bar', () => ({
  ...jest.requireActual('cozy-bar'),
  BarLeft: ({ children }) => <div data-testid="bar-slot">{children}</div>,
  BarCenter: ({ children }) => <div data-testid="bar-slot">{children}</div>
}))

describe('MobileBreadcrumb', () => {
  it('works', async () => {
    const path = [
      { id: '1', name: 'root folder' },
      { id: '2', name: 'parent folder' },
      { id: '3', name: 'current folder' }
    ]

    const onBreadcrumbClick = jest.fn()

    const { findByText } = render(
      <AppLike client={createMockClient({})}>
        <MobileBreadcrumb
          breakpoints={{ isMobile: true }}
          path={path}
          onBreadcrumbClick={onBreadcrumbClick}
          t={jest.fn()}
        />
      </AppLike>
    )

    // renders the path
    const rootLink = await findByText('root folder')
    await findByText('parent folder')
    await findByText('current folder')

    fireEvent.click(rootLink)
    expect(onBreadcrumbClick).toHaveBeenCalledWith({
      id: '1',
      name: 'root folder'
    })

    const backButton = document.querySelector('button')
    fireEvent.click(backButton)
    expect(onBreadcrumbClick).toHaveBeenCalledWith({
      id: '2',
      name: 'parent folder'
    })
  })

  it('goes back up from its own place when there is no bar', async () => {
    const path = [
      { id: '1', name: 'drive' },
      { id: '2', name: 'sub folder' }
    ]
    const onBreadcrumbClick = jest.fn()

    const { container, findByText } = render(
      <AppLike client={createMockClient({})}>
        <MobileBreadcrumb
          inBar={false}
          path={path}
          onBreadcrumbClick={onBreadcrumbClick}
        />
      </AppLike>
    )

    await findByText('sub folder')
    const backButton = container.querySelector('button')
    expect(backButton.closest('[data-testid="bar-slot"]')).toBe(null)
    fireEvent.click(backButton)
    expect(onBreadcrumbClick).toHaveBeenCalledWith({ id: '1', name: 'drive' })
  })
})
