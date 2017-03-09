'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT, mockF } from '../lib/I18n'
import { PhotoBoard } from '../../src/components/PhotoBoard'

const mockFetchedPhotos = [{
  title: '2017-01-01',
  photos: [
    {
      _id: '33dda00f0eec15bc3b3c59a615001ac8',
      dir_id: '22545465ezfzef4664686446648684',
      created_at: '0001-01-01T00:00:00Z',
      name: 'MonImage.jpg',
      size: '150000',
      updated_at: '0001-01-01T00:00:00Z'
    }
  ]
}]

describe('PhotoBoard component', () => {
  it('should render correctly a timeline of photos according a photos array', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isIndexing is true', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} isIndexing />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isFetching is true', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} isFetching />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isWorking is true', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} isWorking />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly a loading view if isFirstFetch is true', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={mockFetchedPhotos} selected={[]} isFirstFetch />
    ).node
    expect(component).toMatchSnapshot()
  })

  it('should render correctly an empty view if photos is empty', () => {
    const component = shallow(
      <PhotoBoard t={mockT} f={mockF} photoLists={[]} selected={[]} />
    ).node
    expect(component).toMatchSnapshot()
  })
})
