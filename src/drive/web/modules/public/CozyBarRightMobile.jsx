import cozyBar from 'lib/cozyBar'

const { BarRight } = cozyBar

import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

const CozyBarRightMobile = ({ children }) => {
  const { isMobile } = useBreakpoints()

  if (isMobile) {
    return <BarRight>{children}</BarRight>
  }

  return <>{children}</>
}

export default CozyBarRightMobile
