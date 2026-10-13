import React, { useCallback } from 'react'

import { BarCenter, BarLeft } from 'cozy-bar'

import BackButton from '@/components/Button/BackButton'
import Breadcrumb from '@/modules/breadcrumb/components/Breadcrumb'

const MobileBreadcrumb = ({
  onBreadcrumbClick,
  path,
  inBar = true,
  ...props
}) => {
  const navigateBack = useCallback(() => {
    const parentFolder = path[path.length - 2]
    onBreadcrumbClick(parentFolder)
  }, [onBreadcrumbClick, path])

  const backButton =
    path.length >= 2 ? <BackButton onClick={navigateBack} /> : null
  const breadcrumb = (
    <Breadcrumb {...props} path={path} onBreadcrumbClick={onBreadcrumbClick} />
  )

  if (!inBar) {
    return (
      <div className="u-flex u-flex-items-center u-w-100">
        {backButton}
        {breadcrumb}
      </div>
    )
  }

  return (
    <div>
      {backButton && <BarLeft>{backButton}</BarLeft>}
      <BarCenter>{breadcrumb}</BarCenter>
    </div>
  )
}

export default MobileBreadcrumb
