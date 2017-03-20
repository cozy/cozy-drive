/* eslint-env jest */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import {
  SELECT_PHOTO,
  UNSELECT_PHOTO,
  SHOW_SELECTION_BAR,
  HIDE_SELECTION_BAR
} from '../../src/constants/actionTypes'

import {
  showSelectionBar,
  hideSelectionBar,
  togglePhotoSelection
} from '../../src/actions/selection'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)

describe('showSelectionBar', () => {
  it('should dispatch an action to show selection bar', () => {
    const expectedActions = [
      {
        type: SHOW_SELECTION_BAR
      }
    ]
    const store = mockStore({ })
    store.dispatch(showSelectionBar())
    expect(store.getActions()).toEqual(expectedActions)
  })
})

describe('hideSelectionBar', () => {
  it('should dispatch an action to hide selection bar', () => {
    const expectedActions = [
      {
        type: HIDE_SELECTION_BAR
      }
    ]
    const store = mockStore({ })
    store.dispatch(hideSelectionBar())
    expect(store.getActions()).toEqual(expectedActions)
  })
})

describe('togglePhotoSelection', () => {
  it('should dispatch an action to select a photo if selected is false', () => {
    const expectedActions = [
      {
        type: SELECT_PHOTO,
        id: 'idPhoto42'
      }
    ]
    const store = mockStore({ })
    store.dispatch(togglePhotoSelection('idPhoto42', false))
    expect(store.getActions()).toEqual(expectedActions)
  })

  it('should dispatch an action to unselect a photo if selected is true', () => {
    const expectedActions = [
      {
        type: UNSELECT_PHOTO,
        id: 'idPhoto42'
      }
    ]
    const store = mockStore({ })
    store.dispatch(togglePhotoSelection('idPhoto42', true))
    expect(store.getActions()).toEqual(expectedActions)
  })
})
