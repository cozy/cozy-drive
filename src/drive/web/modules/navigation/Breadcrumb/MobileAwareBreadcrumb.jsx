/* global cozy */
import React from 'react'
import RouterBreadCrumb from './RouterBreadCrumb'
import RouterPreviousButton from './RouterPreviousButton'

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
export default MobileAwareBreadcrumb
