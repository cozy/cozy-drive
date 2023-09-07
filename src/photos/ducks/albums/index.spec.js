import React from 'react'
import { render, screen } from '@testing-library/react'

import { useQuery, createMockClient } from 'cozy-client'

import { AlbumPhotosWithLoader } from './index'
import { PhotosAppLike } from 'test/components/AppLike'
import { useParams } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}))

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useQuery: jest.fn()
}))

describe('Album view', () => {
  const setup = ({ albumId = '123' } = {}) => {
    useParams.mockReturnValue({ albumId })
    const client = createMockClient({})
    return render(
      <PhotosAppLike client={client}>
        <AlbumPhotosWithLoader />
      </PhotosAppLike>
    )
  }

  it('should show a loader', async () => {
    // Given
    useQuery.mockReturnValue({
      data: {},
      fetchStatus: 'loading'
    })

    // When
    setup()

    // Then
    const label = await screen.findByTestId('loading')
    expect(label).toBeInTheDocument()
  })

  it('should display an empty state when loaded without photos', async () => {
    // Given
    useQuery.mockReturnValue({
      data: {
        photos: {
          data: [],
          hasMore: false,
          fetchMore: jest.fn()
        }
      },
      fetchStatus: 'loaded'
    })

    // When
    setup()

    // Then
    const label = await screen.findByText(
      'There is no photo in this album yet.'
    )
    expect(label).toBeInTheDocument()
  })

  it('should show a spinner when no album can be loaded', async () => {
    // Given
    useQuery.mockReturnValue({
      data: null,
      fetchStatus: 'loaded'
    })

    // When
    setup()

    // Then
    const label = await screen.findByTestId('loading')
    expect(label).toBeInTheDocument()
  })
})
