import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'

import MobileBreadcrumb from './MobileBreadcrumb'
import AppLike from 'test/components/AppLike'

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
})
