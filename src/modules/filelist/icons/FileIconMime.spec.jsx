import { render } from '@testing-library/react'
import React from 'react'

import FileIconMime from './FileIconMime'

describe('FileIconMime', () => {
  it('should render a folder whose decorations are not strings', () => {
    // Given
    const folder = {
      type: 'directory',
      name: 'Administrative',
      metadata: { decorations: { color: 12345, icon: { a: 1 } } }
    }

    // When
    const { container } = render(<FileIconMime file={folder} />)

    // Then
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
