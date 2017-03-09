'use strict'

/* eslint-env jest */

// Specifying mock directly, manual mocks in __mocks__ subfolder, as described
// in https://facebook.github.io/jest/docs/manual-mocks.html seems to not
// work properly.
jest.mock('cozy-ui/react/Modal', () => {})

import React from 'react'
import { shallow } from 'enzyme'

import Connected, { Timeline, mapDispatchToProps } from '../../src/containers/Timeline'

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('Timeline component', () => {
  it('should be rendered correctly without store', () => {
    // render
    const component = shallow(
      <Timeline
        isFetching
        photos={[]}
        mangoIndexByDate='_design/54d3474c4efdfe10d790425525e56433857955a1'
        onFirstFetch={(mangoIndex) => mangoIndex}
      />
    )
    // test componentWillReceiveProps
    component.setProps({
      photos: [],
      isFirstFetch: true
    })
    expect(component.node).toMatchSnapshot()
  })

  it('should be rendered correctly with params if params from router provided', () => {
    // render
    const component = shallow(
      <Timeline
        isFetching
        photos={[]}
        mangoIndexByDate='_design/54d3474c4efdfe10d790425525e56433857955a1'
        onFirstFetch={(mangoIndex) => mangoIndex}
        params={{photoId: '33dda00f0eec15bc3b3c59a615001ac8'}}
      />
    )
    // test componentWillReceiveProps
    component.setProps({
      photos: [],
      isFirstFetch: true
    })
    expect(component.node).toMatchSnapshot()
  })

  it('should have correct connected provided props', () => {
    const store = mockStore({
      ui: {
        isFetching: true,
        isIndexing: false,
        isWorking: false,
        selected: []
      },
      photos: [],
      mango: {
        filesIndexByDate: '_design/54d3474c4efdfe10d790425525e56433857955a1'
      },
      timeline: {
        isFirstFetch: true
      }
    })
    const component = shallow(
      <Connected
        store={store}
      />
    )
    component.setProps({
      photos: [],
      isFirstFetch: true
    })
    expect(component.node).toMatchSnapshot()
  })

  it('should render correctly if it has correct connected provided props', () => {
    const store = mockStore({
      ui: {
        isFetching: true,
        isIndexing: false,
        isWorking: false,
        selected: []
      },
      photos: [],
      mango: {
        filesIndexByDate: '_design/54d3474c4efdfe10d790425525e56433857955a1'
      },
      timeline: {
        isFirstFetch: true
      }
    })
    const component = shallow(
      <Connected
        store={store}
      />
    )
    component.setProps({
      photos: [],
      isFirstFetch: true
    })
    expect(component.shallow().node).toMatchSnapshot()
  })

  it('should use a correct a mapDispatchToProps with correct dispatch calls', () => {
    // set
    const dispatchMock = jest.fn().mockReturnValue(Promise.resolve([]))
    const nextProps = mapDispatchToProps(dispatchMock, null)

    // act
    nextProps.onFetchPhotoLists(true, [], text => text)

    // assert
    // onFirstFetch call an action using dispatch
    expect(dispatchMock.mock.calls.length).toBe(1)
  })
})
