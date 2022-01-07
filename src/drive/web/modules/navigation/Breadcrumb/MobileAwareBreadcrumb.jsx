/* global cozy */
import React, { useCallback } from 'react'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import BreadCrumb from 'drive/web/modules/navigation/Breadcrumb/Breadcrumb'
import PreviousButton from 'drive/web/modules/navigation/Breadcrumb/PreviousButton'

export const MobileBreadcrumb = props => {
  const { BarCenter, BarLeft } = cozy.bar
  const { onBreadcrumbClick, path } = props
  const navigateBack = useCallback(() => {
    const parentFolder = path[path.length - 2]
    onBreadcrumbClick(parentFolder)
  }, [onBreadcrumbClick, path])

  return props.breakpoints.isMobile ? (
    <div>
      {props.path.length >= 2 && (
        <BarLeft>
          <PreviousButton onClick={navigateBack} />
        </BarLeft>
      )}
      <BarCenter>
        <BreadCrumb {...props} />
      </BarCenter>
    </div>
  ) : (
    <BreadCrumb {...props} />
  )
}

export const MobileAwareBreadcrumb = withBreakpoints()(MobileBreadcrumb)
