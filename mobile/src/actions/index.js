/* global __ALLOW_HTTP__ */

import cozy from 'cozy-client-js'
import { init } from '../lib/cozy_init'
import localforage from 'localforage'

export const SETUP = 'SETUP'
export const SET_URL = 'SET_URL'
export const SET_STATE = 'SET_STATE'
export const ERROR = 'ERROR'

const WRONG_ADDRESS = 'mobile.onboarding.server_selection.wrong_address'

const error = () => ({ type: ERROR, error: WRONG_ADDRESS })

export class OnBoardingError extends Error {
  constructor (message) {
    super(message)
    this.name = 'OnBoardingError'
  }
}

export const setUrl = (url) => {
  return async dispatch => {
    let scheme = 'https://'
    if (__ALLOW_HTTP__) {
      scheme = 'http://'
      console.warn('development mode: we don\'t check SSL requirement')
    }
    if (/(.*):\/\/(.*)/.test(url) && !url.startsWith(scheme)) {
      dispatch(error())
      throw new OnBoardingError(`The only supported protocol is ${scheme}`)
    }
    if (!url.startsWith(scheme)) {
      url = `${scheme}${url}`
    }
    return dispatch({ type: SET_URL, url: url })
  }
}

// TODO need to refactor this braces hell
export const registerDevice = (router, location) => {
  return async (dispatch, getState) => {
    await dispatch(setUrl(getState().mobile.serverUrl))
    await init(getState().mobile.serverUrl)
    try {
      await cozy.authorize()
    } catch (err) {
      dispatch(error())
      throw err
    }

    dispatch({ type: SETUP })
    localforage.setItem('state', getState().mobile)
    if (location.state && location.state.nextPathname) {
      router.replace(location.state.nextPathname)
    } else {
      router.replace('/')
    }
  }
}
