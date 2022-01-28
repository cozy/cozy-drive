/* global cozy */
import React, { useCallback } from 'react'
import Breadcrumb from '../../Breadcrumb'
import PreviousButton from '../../PreviousButton'

const MobileBreadcrumb = ({ onBreadcrumbClick, path, ...props }) => {
  const { BarCenter, BarLeft } = cozy.bar

  const navigateBack = useCallback(() => {
    const parentFolder = path[path.length - 2]
    onBreadcrumbClick(parentFolder)
  }, [onBreadcrumbClick, path])

  return (
    <div>
      {path.length >= 2 && (
        <BarLeft>
          <PreviousButton onClick={navigateBack} />
        </BarLeft>
      )}
      <BarCenter>
        <Breadcrumb
          {...props}
          path={path}
          onBreadcrumbClick={onBreadcrumbClick}
        />
      </BarCenter>
    </div>
  )
}

export default MobileBreadcrumb
