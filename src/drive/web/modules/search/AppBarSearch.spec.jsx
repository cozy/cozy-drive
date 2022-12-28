import React from 'react'
import { render } from '@testing-library/react'

import CozyClient from 'cozy-client'

import AppBarSearch from 'drive/web/modules/search/AppBarSearch'
import AppLike from 'test/components/AppLike'

jest.mock('drive/web/modules/services/components/iconContext', () => ({
  getIconUrl: () => 'iconUrl'
}))

it('should display the Searchbar', () => {
  const client = new CozyClient({})
  const appBarSearch = render(
    <AppLike client={client}>
      <AppBarSearch />
    </AppLike>
  )
  expect(appBarSearch).toMatchSnapshot()
})
