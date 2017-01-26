'use strict'

/* eslint-env jest */

import React from 'react'
import { shallow } from 'enzyme'

import { mockT } from '../lib/I18n'
import Connected, { UploadButton, mapDispatchToProps } from '../../src/containers/UploadButton'

import thunk from 'redux-thunk'
import configureMockStore from 'redux-mock-store'
const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('UploadButton component', () => {
  it('should be rendered correctly without store', () => {
    // render
    const component = shallow(
      <UploadButton
        t={mockT}
        uploadPhotos={(photosArray) => photosArray}
      />
    ).node
    // test componentWillReceiveProps
    expect(component).toMatchSnapshot()
  })

  it('should be handled correctly the input onChange for uploadPhotos', () => {
    // set
    const uploadPhotosMock = jest.fn()
    // render
    const component = shallow(
      <UploadButton
        t={mockT}
        uploadPhotos={uploadPhotosMock}
      />
    )
    // simulate an onChange event
    const e = {
      target: {
        files: [
          {
            name: 'MyImage.jpg',
            size: 128392
          }
        ]
      }
    }
    component.node.props.children[1].props.onChange(e)

    expect(uploadPhotosMock.mock.calls.length).toBe[1]
    expect(component).toMatchSnapshot()
  })

  it('should be rendered correctly with store', () => {
    const store = mockStore({})
    const component = shallow(
      <Connected
        t={mockT}
        store={store}
        uploadPhotos={(photosArray) => photosArray}
      />
    )
    expect(component.shallow().node).toMatchSnapshot()
  })

  it('should use a correct a mapDispatchToProps with correct dispatch calls', () => {
    // set
    const dispatchMock = jest.fn()
    const photo = {
      name: 'monImage.jpg',
      size: 178298
    }
    const nextProps = mapDispatchToProps(dispatchMock, null)

    // act
    nextProps.uploadPhotos(photo)

    // assert
    // onFirstFetch call an action using dispatch
    expect(dispatchMock.mock.calls.length).toBe(1)
  })
})
