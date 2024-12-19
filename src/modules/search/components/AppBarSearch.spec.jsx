import { render, screen } from '@testing-library/react'
import React from 'react'

import CozyClient from 'cozy-client'

import AppBarSearch from 'modules/search/components/AppBarSearch'
import AppLike from 'test/components/AppLike'

it('should display the Searchbar', () => {
  const client = new CozyClient({})
  render(
    <AppLike client={client}>
      <AppBarSearch />
    </AppLike>
  )
  expect(screen.getByPlaceholderText('Search anything')).toBeInTheDocument()
})
