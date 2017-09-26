import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'

import { applySelectorForAction, enhancePropsForActions } from '.'
import { mapValues, filterValues } from './utils'

const connect = (
  mapDocumentsToProps,
  mapActionsToProps = null
) => WrappedComponent => {
  class Wrapper extends Component {
    componentDidMount() {
      const { fetchActions } = this.props
      const dispatch = this.context.store.dispatch
      for (const propName in fetchActions) {
        dispatch(fetchActions[propName])
      }
    }

    render() {
      const { t, f, client, store } = this.context
      const { fetchActions } = this.props
      const props = {
        t,
        f,
        client,
        ...this.props,
        ...enhancePropsForActions(this.props, fetchActions, store.dispatch)
      }
      return <WrappedComponent {...props} />
    }
  }

  const makeMapStateToProps = (initialState, initialOwnProps) => {
    const initialProps = mapDocumentsToProps(initialOwnProps)

    const isAction = action => action && action.types && action.promise
    const fetchActions = filterValues(initialProps, prop => isAction(prop))
    const otherProps = filterValues(initialProps, prop => !isAction(prop))

    const mapStateToProps = state => ({
      ...mapValues(
        fetchActions,
        action =>
          isAction(action) ? applySelectorForAction(state, action) : action
      ),
      fetchActions,
      ...otherProps
    })
    return mapStateToProps
  }

  return reduxConnect(makeMapStateToProps, mapActionsToProps)(Wrapper)
}

export default connect
