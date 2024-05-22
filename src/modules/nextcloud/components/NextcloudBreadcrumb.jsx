import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from 'constants/config'
import { CozyFile } from 'models/index'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/navigation/Breadcrumb/MobileAwareBreadcrumb'

const NextcloudBreadcrumb = ({ shortcut, path }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { isMobile } = useBreakpoints()

  if (!shortcut) {
    return null
  }

  const rootPaths = [
    ...(isMobile
      ? [
          {
            name: t('NextcloudBreadcrumb.root'),
            id: 'root'
          }
        ]
      : []),
    { name: CozyFile.splitFilename(shortcut).filename, id: '/' }
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
