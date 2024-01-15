import { render } from '@testing-library/react'
import React from 'react'

import CozyClient from 'cozy-client'

import AppBarSearch from 'modules/search/AppBarSearch'
import AppLike from 'test/components/AppLike'

it('should display the Searchbar', () => {
  const client = new CozyClient({})
  const appBarSearch = render(
    <AppLike client={client}>
      <AppBarSearch />
    </AppLike>
  )
  expect(appBarSearch).toMatchSnapshot()
})
