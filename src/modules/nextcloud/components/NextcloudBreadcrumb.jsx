import React from 'react'
import { useSearchParams } from 'react-router-dom'

import { CozyFile } from 'models/index'
import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/navigation/Breadcrumb/MobileAwareBreadcrumb'

const NextcloudBreadcrumb = ({ shortcut, path }) => {
  const [searchParams, setSearchParams] = useSearchParams()

  if (!shortcut) {
    return null
  }

  const rootPath = { name: CozyFile.splitFilename(shortcut).filename, id: '/' }

  const splitPath = path.split('/').filter(Boolean)
  const pathList = splitPath.map((folder, index) => ({
    name: folder,
    id: '/' + splitPath.slice(0, index + 1).join('/')
  }))

  const handleBreadcrumbClick = item => {
    searchParams.set('path', item.id)
    setSearchParams(searchParams)
  }

  return (
    <Breadcrumb
      path={[rootPath, ...pathList]}
      onBreadcrumbClick={handleBreadcrumbClick}
    />
  )
}

export { NextcloudBreadcrumb }
