import localforage from 'localforage'

// The withPersistentState HOC automatically saves the wrappped components state and restores it when the component is mounted again.
// Since the saved state will not be available immediately when the wrapped component is mounted, a `componentStateRestored` hook will be called once the state is restored
export const withPersistentState = (WrappedComponent, persistenceKey) => {
  class WithPersistentState extends WrappedComponent {
    async componentWillMount() {
      const persistedState = await localforage.getItem(persistenceKey)
      this.setState(
        prevState => persistedState || prevState,
        () => {
          if (super.componentStateRestored) super.componentStateRestored()
        }
      )
    }

    componentWillUpdate(nextProps, nextState) {
      if (super.componentWillUpdate)
        super.componentWillUpdate(nextProps, nextState)
      localforage.setItem(persistenceKey, nextState)
    }
  }
  WithPersistentState.displayName = `WithPersistentState(${WrappedComponent.displayName ||
    WrappedComponent.name ||
    'Component'})`
  return WithPersistentState
}
export default withPersistentState
