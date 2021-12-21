import React from 'react'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import MobileBreadcrumb from './components/MobileBreadcrumb/MobileBreadcrumb'
import DesktopBreadcrumb from './components/DesktopBreadcrumb/DesktopBreadcrumb'

export const MobileAwareBreadcrumb = props => {
  const { isMobile } = useBreakpoints()

  return isMobile ? (
    <MobileBreadcrumb {...props} />
  ) : (
    <DesktopBreadcrumb {...props} />
  )
}

export default MobileAwareBreadcrumb
