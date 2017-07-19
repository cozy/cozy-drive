'use strict'

/* eslint-env jest */

// Specifying mock directly, manual mocks in __mocks__ subfolder, as described
// in https://facebook.github.io/jest/docs/manual-mocks.html seems to not
// work properly.
jest.mock('cozy-ui/react/Modal', () => {})

import React from 'react'
import { shallow } from 'enzyme'

import { mockT, mockF } from 'cozy-ui/react/I18n'
import { PhotoBoard } from '../../src/containers/PhotoBoard'

const mockFetchedPhotos = [{
  title: '2017-01-01',
  photos: [
    {
      _id: '33dda00f0eec15bc3b3c59a615001ac8',
      dir_id: '22545465ezfzef4664686446648684',
      metadata: {
        datetime: '0001-01-01T00:00:00Z'
      },
      name: 'MonImage.jpg',
      size: '150000',
      updated_at: '0001-01-01T00:00:00Z'
    }
  ]
}]

describe('PhotoBoard component', () => {
  it('should render correctly a timeline of photos according a photos array', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} photosContext='timeline' />
    )
    component.setState({isFetching: false, photoLists: mockFetchedPhotos})
    expect(component.node).toMatchSnapshot()
  })

  it('should render correctly a timeline of photos according a photos array in album context', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} photosContext='album' />
    )
    component.setState({isFetching: false, photoLists: mockFetchedPhotos})
    expect(component.node).toMatchSnapshot()
  })

  it('should render correctly a loading view if isIndexing is true', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} isIndexing photosContext='timeline' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isFetching is true', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} isFetching photosContext='timeline' />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isWorking is true', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} isWorking photosContext='timeline' />
    )
    component.setState({isFetching: false})
    expect(component.node).toMatchSnapshot()
  })

  it('should render correctly an empty view if photos is empty', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={[]} selected={[]} photosContext='timeline' />
    )
    component.setState({isFetching: false, photoLists: []})
    expect(component.node).toMatchSnapshot()
  })
})
