import React from 'react'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import { MobileAwareBreadcrumbV2 as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'

const RecentBreadcrumb = () => {
  const { t } = useI18n()

  return (
    <Breadcrumb
      path={[{ name: t('breadcrumb.title_trash') }]}
      opening={false}
    />
  )
}

export default RecentBreadcrumb
