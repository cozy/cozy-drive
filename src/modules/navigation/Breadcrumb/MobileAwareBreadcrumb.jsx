import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import DesktopBreadcrumb from './components/DesktopBreadcrumb/DesktopBreadcrumb'
import MobileBreadcrumb from './components/MobileBreadcrumb/MobileBreadcrumb'

export const MobileAwareBreadcrumb = props => {
  const { isMobile } = useBreakpoints()

  return isMobile ? (
    <MobileBreadcrumb {...props} />
  ) : (
    <DesktopBreadcrumb {...props} />
  )
}

export default MobileAwareBreadcrumb
