import React from 'react'

import SharingContext from 'sharing/context'

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const withSharingState = Wrapped => {
  const WithSharingState = props => {
    return (
      <SharingContext.Consumer>
        {sharingState => <Wrapped sharingState={sharingState} {...props} />}
      </SharingContext.Consumer>
    )
  }

  WithSharingState.displayName = `WithSharingState(${getDisplayName(Wrapped)})`
  return WithSharingState
}

export default withSharingState
