/**
 * Tools to store part of the react-router state inside redux
 */
import { matchPattern } from 'react-router/lib/PatternUtils'
import fromPairs from 'lodash/fromPairs'

const LOCATION_CHANGED = 'HISTORY.LOCATION_CHANGED'

/**
 * Given all the parameterized route, returns a function that will return
 * all params from a location object.
 */
const createParamsExtractor = routes => {
  return location => {
    const pathname = location.pathname
    for (let route of routes) {
      const match = matchPattern(route, pathname)
      if (match && match.remainingPathname === '')
        return fromPairs(
          match.paramNames.map((paramName, index) => [
            paramName,
            match.paramValues[index]
          ])
        )
    }
    return {}
  }
}

export const createReducer = options => {
  const extractParams = createParamsExtractor(options.routes)
  return (state = {}, action = null) => {
    if (action === null) {
      return state
    } else if (action.type === LOCATION_CHANGED) {
      const params = extractParams(action.location)
      return {
        location: action.location,
        params
      }
    }
    return state
  }
}

const locationChanged = (location, action) => ({
  type: LOCATION_CHANGED,
  location: location,
  action: action
})

export const connectStoreToHistory = (store, history) => {
  store.dispatch(locationChanged(history.getCurrentLocation()))

  history.listen((location, action) => {
    store.dispatch(locationChanged(location, action))
  })
}
