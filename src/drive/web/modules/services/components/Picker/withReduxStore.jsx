import React, { Component } from 'react'
import { Provider } from 'react-redux'
import configureStore from 'drive/store/configureStore'

const withReduxStore = WrappedComponent => {
  class WithReduxStore extends Component {
    render() {
      const { client, t } = this.context
      const store = configureStore(client, t)

      return (
        <Provider store={store}>
          <WrappedComponent {...this.props} />
        </Provider>
      )
    }
  }
  WithReduxStore.displayName = `WithReduxStore(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`
  return WithReduxStore
}

export default withReduxStore
