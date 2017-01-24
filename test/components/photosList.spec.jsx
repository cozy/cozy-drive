'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT, mockF } from '../lib/I18n'
import { PhotosList } from '../../src/components/PhotosList'

const mockFetchedPhotos = [
  {
    _id: '33dda00f0eec15bc3b3c59a615001ac8',
    created_at: '0001-01-01T00:00:00Z',
    name: 'MonImage.jpg',
    size: '150000',
    updated_at: '0001-01-01T00:00:00Z'
  }
]

describe('PhotosList component', () => {
  it('should render correctly a timeline of photos according a photos array', () => {
    const component = shallow(
      <PhotosList t={mockT} f={mockF} photos={mockFetchedPhotos} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isIndexing is true', () => {
    const component = shallow(
      <PhotosList t={mockT} f={mockF} photos={mockFetchedPhotos} isIndexing />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isFetching is true', () => {
    const component = shallow(
      <PhotosList t={mockT} f={mockF} photos={mockFetchedPhotos} isFetching />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isWorking is true', () => {
    const component = shallow(
      <PhotosList t={mockT} f={mockF} photos={mockFetchedPhotos} isWorking />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isFirstFetch is true', () => {
    const component = shallow(
      <PhotosList t={mockT} f={mockF} photos={mockFetchedPhotos} isFirstFetch />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly an empty view if photos is empty', () => {
    const component = shallow(
      <PhotosList t={mockT} f={mockF} photos={[]} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
