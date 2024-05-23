import React, { useCallback } from 'react'

import { BarCenter, BarLeft } from 'cozy-bar'

import Breadcrumb from '../../Breadcrumb'
import BackButton from 'components/Button/BackButton'

const MobileBreadcrumb = ({ onBreadcrumbClick, path, ...props }) => {
  const navigateBack = useCallback(() => {
    const parentFolder = path[path.length - 2]
    onBreadcrumbClick(parentFolder)
  }, [onBreadcrumbClick, path])

  return (
    <div>
      {path.length >= 2 && (
        <BarLeft>
          <BackButton onClick={navigateBack} />
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
