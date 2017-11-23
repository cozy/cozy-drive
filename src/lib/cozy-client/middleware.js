import { applySelectorForAction } from './reducer'

const cozyMiddleware = client => ({ dispatch, getState }) => {
  return next => action => {
    const { promise, type, types, dependencies, ...rest } = action
    if (!promise) {
      return next(action)
    }

    if (!type && !types) {
      return promise(client, dispatch, getState).then(action =>
        dispatch(action)
      )
    }

    if (type) {
      return promise(client, dispatch, getState).then(response => {
        next({ ...rest, response, type })
        return response
      })
    }

    const [REQUEST, SUCCESS, FAILURE] = types
    next({ ...rest, type: REQUEST })

    let depsPromises = []
    if (dependencies) {
      dependencies.forEach(dep => {
        const status = applySelectorForAction(getState(), dep).fetchStatus
        if (status === 'pending') {
          depsPromises.push(dispatch(dep))
        }
      })
    }

    return Promise.all(depsPromises)
      .then(() => promise(client, dispatch, getState))
      .then(
        response => {
          next({ ...rest, response, type: SUCCESS })
          return response
        },
        error => {
          console.log(error)
          next({ ...rest, error, type: FAILURE })
        }
      )
      .catch(error => {
        console.error('MIDDLEWARE ERROR:', error)
        next({ ...rest, error, type: FAILURE })
      })
  }
}

export default cozyMiddleware
