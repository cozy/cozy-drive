import React, { useCallback } from 'react'
import { useQuery } from 'cozy-client'
import get from 'lodash/get'
import uniqBy from 'lodash/uniqBy'
import { useI18n } from 'cozy-ui/react/I18n'
import { MobileAwareBreadcrumbV2 as Breadcrumb } from 'drive/web/modules/navigation/Breadcrumb/MobileAwareBreadcrumb'
import { ROOT_DIR_ID } from 'drive/constants/config'
import { buildFolderQuery } from 'drive/web/modules/queries'

const getBreadcrumbPath = (t, displayedFolder) =>
  uniqBy(
    [
      {
        id: ROOT_DIR_ID
      },
      {
        id: get(displayedFolder, 'dir_id')
      },
      {
        id: displayedFolder.id,
        name: displayedFolder.name
      }
    ],
    'id'
  )
    .filter(({ id }) => Boolean(id))
    .map(breadcrumb => ({
      id: breadcrumb.id,
      name:
        breadcrumb.name ||
        (breadcrumb.id === ROOT_DIR_ID ? t('breadcrumb.title_drive') : '…')
    }))

const DriveBreadcrumb = ({ currentFolderId, navigateToFolder }) => {
  const { t } = useI18n()
  const currentFolderQuery = buildFolderQuery(currentFolderId)
  const currentFolderQueryResults = useQuery(
    currentFolderQuery.definition,
    currentFolderQuery.options
  )
  const currentFolder = get(currentFolderQueryResults, 'data[0]')
  const path = currentFolder ? getBreadcrumbPath(t, currentFolder) : []

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

export default DriveBreadcrumb
