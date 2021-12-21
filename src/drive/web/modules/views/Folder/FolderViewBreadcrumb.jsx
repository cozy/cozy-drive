import React, { useCallback } from 'react'
import { useBreadcrumbPath } from '../useBreadcrumbPath.jsx'
import { default as BreadcrumbMui } from '@material-ui/core/Breadcrumbs'

const FolderViewBreadcrumb = ({ currentFolderId, navigateToFolder }) => {
  const paths = useBreadcrumbPath({ currentFolderId })

  const onBreadcrumbClick = useCallback(({ id }) => navigateToFolder(id), [
    navigateToFolder
  ])

  return paths ? (
    <BreadcrumbMui>
      {paths.map(item => (
        <a key={item.name} color="inherit" href="#" onClick={onBreadcrumbClick}>
          {item.name}
        </a>
      ))}
    </BreadcrumbMui>
  ) : null
}

export default FolderViewBreadcrumb
