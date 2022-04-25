import React from 'react'
import { render } from '@testing-library/react'
import FileIcon from './FileIcon'

jest.mock('cozy-flags', () => () => true)
jest.mock('cozy-ui/transpiled/react/FileImageLoader', () => () => (
  <div data-testid="FileImageLoader" />
))

describe('FileIcon', () => {
  it('should return file image loader when file is image', () => {
    // Given
    const file = { class: 'image' }

    // When
    const { getByTestId } = render(<FileIcon file={file} />)

    // Then
    expect(getByTestId('FileImageLoader')).toBeInTheDocument()
  })

  it('should return file image loader when file is pdf', () => {
    // Given
    const file = { class: 'pdf' }

    // When
    const { getByTestId } = render(<FileIcon file={file} />)

    // Then
    expect(getByTestId('FileImageLoader')).toBeInTheDocument()
  })
})
