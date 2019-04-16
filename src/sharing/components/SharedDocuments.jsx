import React from 'react'
import PropTypes from 'prop-types'

import SharingContext from 'sharing/context'

export const SharedDocuments = ({ children }) => (
  <SharingContext.Consumer>
    {({ sharings } = { sharings: [] }) =>
      children({
        sharedDocuments: sharings.map(
          sharing => sharing.attributes.rules[0].values[0]
        )
      })
    }
  </SharingContext.Consumer>
)

SharedDocuments.propTypes = {
  children: PropTypes.node
}

export default SharedDocuments
