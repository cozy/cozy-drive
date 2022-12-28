import React, { useCallback } from 'react'
import Breadcrumb from '../../Breadcrumb'
import { BarCenter, BarLeft } from 'components/Bar'
import BackButton from 'components/Button/BackButton'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

const MobileBreadcrumb = ({ onBreadcrumbClick, path, ...props }) => {
  const navigateBack = useCallback(() => {
    const parentFolder = path[path.length - 2]
    onBreadcrumbClick(parentFolder)
  }, [onBreadcrumbClick, path])
  const { t } = useI18n()

  return (
    <div>
      {path.length >= 2 && (
        <BarLeft>
          <BackButton onClick={navigateBack} t={t} />
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
