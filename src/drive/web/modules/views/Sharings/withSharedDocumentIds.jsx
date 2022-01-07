import React from 'react'
import SharedDocuments from 'cozy-sharing/dist/components/SharedDocuments'

const withSharedDocumentIds = BaseComponent => {
  const WrapperComponent = props => (
    <SharedDocuments>
      {({ sharedDocuments, allLoaded }) => (
        <BaseComponent
          {...props}
          sharedDocumentIds={sharedDocuments}
          allLoaded={allLoaded}
        />
      )}
    </SharedDocuments>
  )

  WrapperComponent.displayName = `withSharedDocumentIds(${BaseComponent.displayName})`

  return WrapperComponent
}

export default withSharedDocumentIds
