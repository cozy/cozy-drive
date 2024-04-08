import { render } from '@testing-library/react'
import React from 'react'

import {
  dummyBreadcrumbPath,
  dummyRootBreadcrumbPath
} from 'test/dummies/dummyBreadcrumbPath'

import FolderViewBreadcrumb from './FolderViewBreadcrumb'
import { useBreadcrumbPath } from './hooks/useBreadcrumbPath'

jest.mock('./hooks/useBreadcrumbPath')
jest.mock('modules/navigation/Breadcrumb/MobileAwareBreadcrumb', () => ({
  // eslint-disable-next-line react/display-name
  MobileAwareBreadcrumb: ({ path, opening }) => (
    <div
      data-testid="MobileAwareBreadcrumb"
      data-path={path}
      data-opening={opening ? 'true' : 'false'}
    />
  )
}))

describe('FolderViewBreadcrumb', () => {
  const rootBreadcrumbPath = dummyRootBreadcrumbPath()

  it('should use breadcrumb path', () => {
    // Given
    const currentFolderId = '1234'
    const sharedDocumentIds = [currentFolderId, '5678']

    // When
    render(
      <FolderViewBreadcrumb
        currentFolderId={currentFolderId}
        navigateToFolder={jest.fn()}
        rootBreadcrumbPath={rootBreadcrumbPath}
        sharedDocumentIds={sharedDocumentIds}
      />
    )

    // Then
    expect(useBreadcrumbPath).toHaveBeenCalledWith({
      currentFolderId,
      rootBreadcrumbPath,
      sharedDocumentIds
    })
  })

  it('should set correct path in template', () => {
    // Given
    useBreadcrumbPath.mockReturnValue(dummyBreadcrumbPath())

    // When
    const { getByTestId } = render(
      <FolderViewBreadcrumb
        currentFolderId="1234"
        navigateToFolder={jest.fn()}
        rootBreadcrumbPath={rootBreadcrumbPath}
      />
    )

    // Then
    expect(getByTestId('MobileAwareBreadcrumb')).toBeTruthy()
    expect(
      getByTestId('MobileAwareBreadcrumb').hasAttribute('data-path')
    ).toEqual(true)
    expect(
      getByTestId('MobileAwareBreadcrumb').getAttribute('data-opening')
    ).toEqual('false')
  })

  it('should be null when path empty', () => {
    // Given
    useBreadcrumbPath.mockReturnValue([])

    // When
    const { container } = render(
      <FolderViewBreadcrumb
        currentFolderId="1234"
        navigateToFolder={jest.fn()}
        rootBreadcrumbPath={rootBreadcrumbPath}
      />
    )

    // Then
    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('should be null when path undefined', () => {
    // Given
    useBreadcrumbPath.mockReturnValue()

    // When
    const { container } = render(
      <FolderViewBreadcrumb
        currentFolderId="1234"
        navigateToFolder={jest.fn()}
        rootBreadcrumbPath={rootBreadcrumbPath}
      />
    )

    // Then
    expect(container).toMatchInlineSnapshot(`<div />`)
  })
})
