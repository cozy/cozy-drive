import React, { forwardRef } from 'react'

import Divider from 'cozy-ui/transpiled/react/Divider'

export const hr = () => {
  return {
    name: 'hr',
    icon: 'hr',
    displayInSelectionBar: false,
    Component: forwardRef(function hr(_, ref) {
      return <Divider ref={ref} className="u-mv-half" />
    })
  }
}
