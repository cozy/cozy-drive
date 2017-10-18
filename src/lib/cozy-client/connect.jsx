import React, { Component } from 'react'
import { connect as reduxConnect } from 'react-redux'

import { getCollection, getDocument } from '.'
import { mapValues, filterValues } from './utils'
import { makeFetchMoreAction } from './reducer'

const isFetchCollection = action =>
  action.types[0] === 'FETCH_COLLECTION' ||
  action.types[0] === 'FETCH_REFERENCED_FILES'

const enhanceProps = (props, fetchActions, dispatch) =>
  mapValues(fetchActions, (action, propName) => {
    const dataObject = props[propName]
    if (!isFetchCollection(action)) {
      return dataObject
    }
    const fetchMore = dataObject.hasMore
      ? () => dispatch(makeFetchMoreAction(action, dataObject.data.length))
      : null
    return {
      ...dataObject,
      fetchMore
    }
  })

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
        ...enhanceProps(this.props, fetchActions, store.dispatch)
      }
      return <WrappedComponent {...props} />
    }
  }

  const makeMapStateToProps = (initialState, initialOwnProps) => {
    const initialProps = mapDocumentsToProps(initialOwnProps)

    const isAction = action => action && action.types && action.promise
    const fetchActions = filterValues(initialProps, prop => isAction(prop))
    const otherProps = filterValues(initialProps, prop => !isAction(prop))

    const selector = (state, action) => {
      return isFetchCollection(action)
        ? getCollection(state, action.collection)
        : getDocument(state, action.doctype, action.id)
    }

    const mapStateToProps = state => ({
      ...mapValues(
        fetchActions,
        action => (isAction(action) ? selector(state, action) : action)
      ),
      fetchActions,
      ...otherProps
    })
    return mapStateToProps
  }

  return reduxConnect(makeMapStateToProps, mapActionsToProps)(Wrapper)
}

export default connect
