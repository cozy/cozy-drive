import React, { Component } from 'react'
import {
  filterSharedByLinkDocuments,
  filterSharedWithMeDocuments,
  filterSharedWithOthersDocuments,
  SHARED_BY_LINK,
  SHARED_WITH_ME,
  SHARED_WITH_OTHERS
} from './'

/*
Injects sharing information for documents that are fetched via cozy-connect.
It can inject 3 props:
- sharedByLink
- sharedWithMe
- sharedWithOthers

`propName`is the name of the collection provided by cozy-connect, `doctype` is the... uh, doctype, and `sharingTypes` is the list of sharing types that should be injected as props, and they have to be one of the constants `SHARED_BY_LINK`, `SHARED_WITH_ME` or `SHARED_WITH_OTHERS`
*/
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

      this.fetchedIds = []
    }

    componentWillReceiveProps (newProps) {
      const propValue = newProps[propName]

      if (propValue) {
        // a cozy-connect collection can have a prop named `ids` or `id`, depending on how many documents are being fetched
        let ids
        if (propValue.ids) ids = propValue.ids
        else if (propValue.id) ids = [propValue.id]
        else ids = []

        if (ids.length === 0 || JSON.stringify(ids) === JSON.stringify(this.fetchedIds)) return
        this.fetchedIds = ids

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
