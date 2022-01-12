import React from 'react'
import { render } from '@testing-library/react'
import InsideRegularFolder from './InsideRegularFolder'

jest.mock('drive/web/modules/drive/Toolbar/toolbar', () => children => children)

describe('InsideRegularFolder', () => {
  it('should return null when insideRegularFolder undefined', () => {
    // When
    const { container } = render(<InsideRegularFolder />)

    // Then
    expect(container).toBeEmptyDOMElement()
  })

  it('should return children when insideRegularFolder defined', () => {
    // When
    const { container } = render(
      <InsideRegularFolder insideRegularFolder>
        <div />
      </InsideRegularFolder>
    )

    // Then
    expect(container).not.toBeEmptyDOMElement()
  })
})
