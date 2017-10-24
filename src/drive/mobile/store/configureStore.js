/* global __DEVELOPMENT__ */
const configureStore = __DEVELOPMENT__
  ? require('./configureStore.dev').default
  : require('./configureStore.prod').default

export default configureStore
