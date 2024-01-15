import { render } from '@testing-library/react'
import React from 'react'

import { createMockClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import PublicLayout from './PublicLayout'
import AppLike from 'test/components/AppLike'

jest.mock('modules/upload/UploadQueue', () => () => {
  return null
})
const client = new createMockClient({})

describe('PublicLayout', () => {
  it('should show translated alert messages', async () => {
    const { findByText } = render(
      <AppLike client={client}>
        <PublicLayout>
          <div>content</div>
        </PublicLayout>
      </AppLike>
    )

    Alerter.info('alert.try_again')
    const translatedAlert = await findByText(
      'An error has occurred, please try again in a moment.'
    )
    expect(translatedAlert).toBeTruthy()
  })
})
