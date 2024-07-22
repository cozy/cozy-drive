import React from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from 'constants/config'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/breadcrumb/components/MobileAwareBreadcrumb'
import { useNextcloudInfos } from 'modules/nextcloud/hooks/useNextcloudInfos'

const NextcloudBreadcrumb = ({ sourceAccount, path }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { t } = useI18n()

  const { rootFolderName } = useNextcloudInfos({ sourceAccount })

  const rootPaths = [
    {
      name: t('breadcrumb.title_drive'),
      id: ROOT_DIR_ID
    },
    {
      name: t('breadcrumb.title_shared_drives'),
      id: 'io.cozy.files.shared-drives-dir'
    },
    { name: rootFolderName, id: '/' }
  ]

  const splitPath = path.split('/').filter(Boolean)
  const pathList = splitPath.map((folder, index) => {
    if (folder === 'trash') {
      return {
        name: t('NextcloudBreadcrumb.trash'),
        id: '/trash/'
      }
    }

    return {
      name: folder,
      id: '/' + splitPath.slice(0, index + 1).join('/')
    }
  })

  const handleBreadcrumbClick = item => {
    if (
      item.id === 'io.cozy.files.shared-drives-dir' ||
      item.id === ROOT_DIR_ID
    ) {
      navigate(`/folder/${item.id}`)
    } else if (pathname.endsWith('trash') && item.id === '/') {
      navigate('..', { relative: 'path' })
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
