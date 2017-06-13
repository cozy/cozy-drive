import getReducers from '../reducers'

const saveState = (store) => {
  // no persiste state on browser
}

const getMiddlewares = () => {
  return []
}

export { getReducers, saveState, getMiddlewares }
