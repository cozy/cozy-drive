import React from 'react'
import { shallow } from 'enzyme'
import { AlbumPhotosWithLoader } from './index'

describe('Album view', () => {
  it('should show a loader', () => {
    const component = shallow(
      <AlbumPhotosWithLoader data={[]} fetchStatus="loading" />
    )
    expect(component).toMatchSnapshot()
  })

  it('should show an album when loaded', () => {
    const component = shallow(
      <AlbumPhotosWithLoader
        data={{
          photos: {
            data: [],
            hasMore: false,
            fetchMore: jest.fn()
          }
        }}
        fetchStatus="loaded"
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('should show a spinner when no album can be loaded', () => {
    const component = shallow(
      <AlbumPhotosWithLoader data={null} fetchStatus="loaded" />
    )
    expect(component).toMatchSnapshot()
  })
})
