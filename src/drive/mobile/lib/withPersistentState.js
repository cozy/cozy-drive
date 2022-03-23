import localforage from 'localforage'

import { cancelable as makeCancelable } from 'cozy-client/dist/utils'

// The withPersistentState HOC automatically saves the wrappped components state and restores it when the component is mounted again.
// Since the saved state will not be available immediately when the wrapped component is mounted, a `componentStateRestored` hook will be called once the state is restored
export const withPersistentState = (WrappedComponent, persistenceKey) => {
  class WithPersistentState extends WrappedComponent {
    constructor(props) {
      super(props)
      this.persistedStatePromise = null
      this.setItemPromise = null
    }
    async componentWillMount() {
      try {
        this.persistedStatePromise = makeCancelable(
          localforage.getItem(persistenceKey)
        )
        const persistedState = await this.persistedStatePromise
        this.setState(
          prevState => persistedState || prevState,
          () => {
            if (super.componentStateRestored) super.componentStateRestored()
          }
        )
      } catch (e) {
        if (e.canceled !== true) {
          // eslint-disable-next-line
          console.log('error', e)
        }
      }
    }

    componentWillUpdate(nextProps, nextState) {
      try {
        if (super.componentWillUpdate)
          super.componentWillUpdate(nextProps, nextState)
        this.setItemPromise = makeCancelable(
          localforage.setItem(persistenceKey, nextState)
        )
      } catch (e) {
        if (e.canceled !== true) {
          // eslint-disable-next-line
          console.log('error', e)
        }
      }
    }

    componentWillUnmount() {
      this.setItemPromise && this.setItemPromise.cancel()
      this.persistedStatePromise.cancel()
    }
  }
  WithPersistentState.displayName = `WithPersistentState(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`
  return WithPersistentState
}
export default withPersistentState
