/* global cozy */
import React, { useCallback } from 'react'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import RouterBreadCrumb from 'drive/web/modules/navigation/Breadcrumb/RouterBreadcrumb'
import RouterPreviousButton from 'drive/web/modules/navigation/Breadcrumb/RouterPreviousButton'
import BreadCrumb from 'drive/web/modules/navigation/Breadcrumb/Breadcrumb'
import PreviousButton from 'drive/web/modules/navigation/Breadcrumb/PreviousButton'

const LegacyMobileAwareBreadcrumb = props => {
  const { BarCenter, BarLeft } = cozy.bar

  return props.breakpoints.isMobile ? (
    <div>
      {props.path.length >= 2 && (
        <BarLeft>
          <RouterPreviousButton {...props} />
        </BarLeft>
      )}
      <BarCenter>
        <RouterBreadCrumb {...props} />
      </BarCenter>
    </div>
  ) : (
    <RouterBreadCrumb {...props} />
  )
}

export default withBreakpoints()(LegacyMobileAwareBreadcrumb)

export const MobileAwareBreadcrumb = props => {
  const { BarCenter, BarLeft } = cozy.bar
  const { onBreadcrumbClick, path } = props
  const navigateBack = useCallback(
    () => {
      const parentFolder = path[path.length - 2]
      onBreadcrumbClick(parentFolder)
    },
    [onBreadcrumbClick, path]
  )

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

export const MobileAwareBreadcrumbV2 = withBreakpoints()(MobileAwareBreadcrumb)
