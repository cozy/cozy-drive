import React, { Component } from 'react'
import {
  filterSharedByLinkDocuments,
  filterSharedWithMeDocuments,
  filterSharedWithOthersDocuments,
  SHARED_BY_LINK,
  SHARED_WITH_ME,
  SHARED_WITH_OTHERS
} from './'

const withSharings = (WrappedComponent, propName, doctype, sharingTypes = []) => {
  return class extends Component {
    constructor (props) {
      super(props)

      if (sharingTypes.indexOf(SHARED_BY_LINK) > -1) {
        this.state.sharedByLink = []
        this.trackSharedByLinks = true
      } else {
        this.trackSharedByLinks = false
      }

      if (sharingTypes.indexOf(SHARED_WITH_ME) > -1) {
        this.state.sharedWithMe = []
        this.trackSharedWithMe = true
      } else {
        this.trackSharedWithMe = false
      }

      if (sharingTypes.indexOf(SHARED_WITH_OTHERS) > -1) {
        this.state.sharedWithOthers = []
        this.trackSharedWithOthers = true
      } else {
        this.trackSharedWithOthers = false
      }
    }

    componentWillReceiveProps (newProps) {
      const propValue = newProps[propName]

      if (propValue) {
        const ids = propValue.ids ? propValue.ids : [propValue.id]

        if (ids.length === 0) return

        let filterSharings = []
        if (this.trackSharedByLinks) filterSharings.push(filterSharedByLinkDocuments(ids, doctype))
        if (this.trackSharedWithMe) filterSharings.push(filterSharedWithMeDocuments(ids, doctype))
        if (this.trackSharedWithOthers) filterSharings.push(filterSharedWithOthersDocuments(ids, doctype))

        Promise.all(filterSharings)
        .then(sharedIds => {
          let updatedState = {}
          if (this.trackSharedByLinks) updatedState.sharedByLink = sharedIds.shift()
          if (this.trackSharedWithMe) updatedState.sharedWithMe = sharedIds.shift()
          if (this.trackSharedWithOthers) updatedState.sharedWithOthers = sharedIds.shift()

          this.setState(updatedState)
        })
      }
    }

    render () {
      return <WrappedComponent {...this.props} {...this.state} />
    }
  }
}

export default withSharings
