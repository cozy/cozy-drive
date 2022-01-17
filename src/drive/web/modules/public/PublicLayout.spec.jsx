import React from 'react'
import { render } from '@testing-library/react'
import { createMockClient } from 'cozy-client'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import AppLike from 'test/components/AppLike'
import PublicLayout from './PublicLayout'

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
