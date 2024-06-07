import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from 'constants/config'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import { useNextcloudInfos } from 'modules/nextcloud/hooks/useNextcloudInfos'

const NextcloudBreadcrumb = ({ sourceAccount, path }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  const { rootFolderName } = useNextcloudInfos({ sourceAccount })

  const rootPaths = [
    ...(isMobile
      ? [
          {
            name: t('NextcloudBreadcrumb.root'),
            id: 'root'
          }
        ]
      : []),
    { name: rootFolderName, id: '/' }
  ]

  const splitPath = path.split('/').filter(Boolean)
  const pathList = splitPath.map((folder, index) => ({
    name: folder,
    id: '/' + splitPath.slice(0, index + 1).join('/')
  }))

  const handleBreadcrumbClick = item => {
    if (item.id === 'root') {
      navigate(`/folder/${ROOT_DIR_ID}?tab=shared_drives`)
    } else {
      searchParams.set('path', item.id)
      setSearchParams(searchParams)
    }
  }

  return (
    <Breadcrumb
      path={[...rootPaths, ...pathList]}
      onBreadcrumbClick={handleBreadcrumbClick}
    />
  )
}

export { NextcloudBreadcrumb }
