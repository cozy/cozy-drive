import React from 'react'
import { render } from '@testing-library/react'
import InsideRegularFolder from './InsideRegularFolder'

jest.mock('hooks')

describe('InsideRegularFolder', () => {
  it('should return null when insideRegularFolder undefined', () => {
    const { container } = render(
      <InsideRegularFolder>
        <div />
      </InsideRegularFolder>
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('should return children when insideRegularFolder true', () => {
    const { container } = render(
      <InsideRegularFolder
        displayedFolder={{ id: 'displayed-folder' }}
        folderId={'current-folder'}
      >
        <div />
      </InsideRegularFolder>
    )

    expect(container).not.toBeEmptyDOMElement()
  })
})
