import React from 'react'

//eslint-disable-next-line
const withClient = WrappedComponent => (props, context) => (
  <WrappedComponent {...props} client={context.client} />
)

export default withClient
