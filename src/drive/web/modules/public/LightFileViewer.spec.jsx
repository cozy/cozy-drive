import React from 'react'
import { render } from '@testing-library/react'

import { createMockClient } from 'cozy-client'

import LightFileViewer from './LightFileViewer'
import AppLike from 'test/components/AppLike'

const client = new createMockClient({})

describe('LightFileViewer', () => {
  it('should not have toolbar in the viewer', () => {
    const { queryByRole } = render(
      <AppLike client={client}>
        <LightFileViewer files={[{ id: '01' }]} isFile={true} />
      </AppLike>
    )

    expect(queryByRole('viewer-toolbar')).toBeFalsy()
  })
})
