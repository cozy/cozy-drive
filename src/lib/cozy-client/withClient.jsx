import React from 'react'

const withClient = WrappedComponent => (props, context) => (
  <WrappedComponent {...props} client={context.client} />
)

export default withClient
