/* global cozy */
import React from 'react'
import { withBreakpoints } from 'cozy-ui/transpiled/react'
import RouterBreadCrumb from './RouterBreadCrumb'
import RouterPreviousButton from './RouterPreviousButton'
import BreadCrumb from './BreadCrumb'
import PreviousButton from './PreviousButton'

const MobileAwareBreadcrumb = props => {
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

export default withBreakpoints()(MobileAwareBreadcrumb)

export const MobileAwareBreadcrumbV2 = withBreakpoints()(props => {
  const { BarCenter, BarLeft } = cozy.bar

  return props.breakpoints.isMobile ? (
    <div>
      {props.path.length >= 2 && (
        <BarLeft>
          <PreviousButton {...props} />
        </BarLeft>
      )}
      <BarCenter>
        <BreadCrumb {...props} />
      </BarCenter>
    </div>
  ) : (
    <BreadCrumb {...props} />
  )
})
