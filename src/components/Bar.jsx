import React from 'react'

import { BarRight } from 'cozy-bar'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

const BarRightOnMobile = ({ children }) => {
  const { isMobile } = useBreakpoints()

  if (isMobile) {
    return <BarRight>{children}</BarRight>
  }

  return children
}

export { BarRightOnMobile }
