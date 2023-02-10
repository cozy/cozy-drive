import React from 'react'
import { render } from '@testing-library/react'
import InsideRegularFolder from './InsideRegularFolder'
import { useCurrentFolderId, useDisplayedFolder } from 'drive/hooks'

jest.mock('drive/hooks')

describe('InsideRegularFolder', () => {
  it('should return null when insideRegularFolder undefined', () => {
    // Given
    useCurrentFolderId.mockReturnValue()

    // When
    const { container } = render(
      <InsideRegularFolder>
        <div />
      </InsideRegularFolder>
    )

    // Then
    expect(container).toBeEmptyDOMElement()
  })

  it('should return children when insideRegularFolder true', () => {
    // Given
    useCurrentFolderId.mockReturnValue('current-folder')
    useDisplayedFolder.mockReturnValue({ id: 'displayed-folder' })

    // When
    const { container } = render(
      <InsideRegularFolder>
        <div />
      </InsideRegularFolder>
    )

    // Then
    expect(container).not.toBeEmptyDOMElement()
  })
})
