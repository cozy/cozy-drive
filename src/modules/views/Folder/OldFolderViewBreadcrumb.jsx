import get from 'lodash/get'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQuery } from 'cozy-client'

import { MobileAwareBreadcrumb as Breadcrumb } from 'modules/breadcrumb/components/MobileAwareBreadcrumb'
import { buildFolderQuery } from 'queries'

const FolderViewBreadcrumb = ({ currentFolderId, getBreadcrumbPath }) => {
  const navigate = useNavigate()
  const currentFolderQuery = buildFolderQuery(currentFolderId)
  const currentFolderQueryResults = useQuery(
    currentFolderQuery.definition,
    currentFolderQuery.options
  )
  const currentFolder = get(currentFolderQueryResults, 'data[0]')
  const path = currentFolder ? getBreadcrumbPath(currentFolder) : []

  const onBreadcrumbClick = useCallback(
    ({ id }) => {
      navigate(id ? `../${id}` : '..', {
        relative: 'path'
      })
    },
    [navigate]
  )

  return currentFolder ? (
    <Breadcrumb
      path={path}
      onBreadcrumbClick={onBreadcrumbClick}
      opening={false}
    />
  ) : null
}

export default FolderViewBreadcrumb
