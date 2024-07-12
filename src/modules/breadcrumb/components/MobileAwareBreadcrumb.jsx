import React from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import DesktopBreadcrumb from 'modules/breadcrumb/components/DesktopBreadcrumb'
import MobileBreadcrumb from 'modules/breadcrumb/components/MobileBreadcrumb'

export const MobileAwareBreadcrumb = props => {
  const { isMobile } = useBreakpoints()

  return isMobile ? (
    <MobileBreadcrumb {...props} />
  ) : (
    <DesktopBreadcrumb {...props} />
  )
}

export default MobileAwareBreadcrumb
