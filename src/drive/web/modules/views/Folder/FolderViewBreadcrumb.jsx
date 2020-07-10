import React, { useCallback } from 'react'
import { useQuery } from 'cozy-client'
import get from 'lodash/get'
import { MobileAwareBreadcrumb as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import { buildFolderQuery } from 'drive/web/modules/queries'

const FolderViewBreadcrumb = ({
  currentFolderId,
  getBreadcrumbPath,
  navigateToFolder
}) => {
  const currentFolderQuery = buildFolderQuery(currentFolderId)
  const currentFolderQueryResults = useQuery(
    currentFolderQuery.definition,
    currentFolderQuery.options
  )
  const currentFolder = get(currentFolderQueryResults, 'data[0]')
  const path = currentFolder ? getBreadcrumbPath(currentFolder) : []

  const onBreadcrumbClick = useCallback(({ id }) => navigateToFolder(id), [
    navigateToFolder
  ])

  return currentFolder ? (
    <Breadcrumb
      path={path}
      onBreadcrumbClick={onBreadcrumbClick}
      opening={false}
    />
  ) : null
}

export default FolderViewBreadcrumb
